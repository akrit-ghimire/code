// todo
// get gen ai to run

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const responseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    spanishMessage: {
      type: SchemaType.STRING,
      description: "The AI's conversational response in Spanish."
    },
    englishTranslation: {
      type: SchemaType.STRING,
      description: "The English translation of the spanishMessage."
    },
    feedbackHtml: {
      type: SchemaType.STRING,
      description: "CRITICAL: THIS MUST BE WRITTEN ENTIRELY IN ENGLISH. HTML formatted rich text analyzing the user's grammar, spelling, and naturalness. Use Spanish ONLY to quote specific words."
    },
    newVocabularyHtml: {
      type: SchemaType.STRING,
      description: "CRITICAL: THIS MUST BE WRITTEN ENTIRELY IN ENGLISH. HTML formatted rich text explaining any NEW words used by the AI. Include root and tense for verbs. Leave empty if no new words."
    }
  },
  required: ["spanishMessage", "englishTranslation", "feedbackHtml", "newVocabularyHtml"],
};


const d = new Date()
document.getElementById('chat-date').innerText = `AI Chat started ${d.toLocaleTimeString()} ${d.toLocaleDateString()}`

const key_elem = document.getElementById("ai-key")
var ai_key = localStorage.getItem("ai-key") || ""
key_elem.value = ai_key
key_elem.onchange = (e) => {
  ai_key = e.target.value
  localStorage.setItem("ai-key", ai_key)
}

const notes_file_elem = document.getElementById("notes-file");
var learned_notes = localStorage.getItem("learned-notes") || ""

const banner = document.getElementById('banner')
if (learned_notes != "") banner.style.display = 'none'

notes_file_elem.onchange = async () => {
  const selectedFile = notes_file_elem.files[0];
  if (!selectedFile) return;

  console.log("Processing Zstandard Anki file:", selectedFile.name);

  try {
    // 1. Unzip the .colpkg archive
    const zip = new JSZip();
    const unzipped = await zip.loadAsync(selectedFile);

    // 2. Look for the NEW compressed database file
    const dbFileCompressed = unzipped.file("collection.anki21b");

    if (!dbFileCompressed) {
      throw new Error("Could not find collection.anki21b. Is this a legacy Anki export?");
    }

    // 3. Get the compressed data as a byte array
    const compressedData = await dbFileCompressed.async("uint8array");

    // 4. Decompress the Zstandard data!
    // fzstd is available globally from the CDN script
    console.log("Decompressing Zstandard database...");
    const dbData = fzstd.decompress(compressedData);

    // 5. Initialize the SQLite WebAssembly module
    const SQL = await initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });

    // 6. Load the DECOMPRESSED database
    const db = new SQL.Database(dbData);

    // 7. Query the 'notes' table
    const res = db.exec("SELECT flds FROM notes");

    if (res.length === 0) {
      console.log("No notes found in this deck.");
      return;
    }

    // 8. Parse the notes into your value pairs
    const rows = res[0].values;
    const condensedNotes = rows.map(row => {
      const rawFields = row[0];

      // Split by the Unit Separator
      const fieldsArray = rawFields.split('\x1F');

      const firstValue = stripHtml(fieldsArray[0] || "");

      if (firstValue == "") {
        return
      }
      // const secondValue = stripHtml(fieldsArray[1] || "");
      // return [firstValue, secondValue];
      return firstValue
    });

    learned_notes = condensedNotes.filter(n => n !== undefined).join(";")
    localStorage.setItem("learned-notes", learned_notes)

    banner.style.display = 'none'
    // Clean up memory
    db.close();

  } catch (error) {
    console.error("Error processing Anki file:", error);
  }
};

// Helper function to remove HTML tags
function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

const analysis_container = document.getElementById("analysis")
const generate_analysis_block = (text) => `<div class="a-item">${text}</div>`

const chat_container = document.getElementById("chat")
const generate_chat_block = (text, isLeft, translated) => `<div class="bubble bubble-${isLeft ? 'left' : 'right'}" ${isLeft ? "onclick='translate_message(this)'" + 'data-translate="' + translated + '"' : ""}>${text}</div>`

const add_analysis = (text) => {
  analysis_container.insertAdjacentHTML('beforeend', generate_analysis_block(text))
}
const add_message = (text, isLeft, translated) => {
  chat_container.insertAdjacentHTML('beforeend', generate_chat_block(text, isLeft, translated))
}

const add_typing = () => {
  var typing_html = `
    <div class="bubble bubble-left bubble-short">
      <div class="typing">
        <span class="circle bouncing"></span>
        <span class="circle bouncing"></span>
        <span class="circle bouncing"></span>
      </div>
    </div>
  `
  chat_container.insertAdjacentHTML('beforeend', typing_html)
}

const translate_message = (element) => {
  var translate = element.dataset.translate
  element.dataset.translate = element.innerText
  element.innerText = translate
}
window.translate_message = translate_message

const remove_typing = () => {
  const typingElement = document.querySelector('.bubble .typing');
  if (typingElement && typingElement.parentElement) {
    typingElement.parentElement.remove();
  }
};

const send_button = document.getElementById("send")
const user_message = document.getElementById("message")

const main = () => {
  if (ai_key == "") return
  if (learned_notes == "") return

  document.getElementById("halt").style.display = "none"
  document.getElementById("chatview").style.display = "grid"

  const genAI = new GoogleGenerativeAI(ai_key);

  const systemInstruction = `
    You are a bilingual Spanish/English tutor. (your name is a sexy male spanish name) You have TWO distinct roles in every response:
    
    ROLE 1: The Conversation Partner (Strictly Spanish)
    - Converse with the user naturally in Spanish in the 'spanishMessage' field.
    - Primarily use this known vocabulary: ${learned_notes}.
    - Ask questions to keep the conversation flowing.
    - Occasionally introduce new words to push their skills.
    
    ROLE 2: The Language Analyst (Strictly English)
    - You MUST write the 'feedbackHtml' and 'newVocabularyHtml' fields ENTIRELY IN ENGLISH. 
    - You may use Spanish in these fields ONLY to quote the user or cite specific words (e.g., "You said 'el agua' which is correct...").
    - Always analyze the user's previous response in 'feedbackHtml'. Correct spelling/grammar, suggest more native-sounding phrasing, or encourage them.
    - If you introduced new words in ROLE 1, explain them in 'newVocabularyHtml' in English. Include root infinitive and tense for verbs.
    - Format both HTML fields using basic tags (<b>, <i>, <ul>, <li>, <br>).
  `;
  const model = genAI.getGenerativeModel({
    // model: "gemini-2.5-flash", // Use flash for fast, conversational responses
    model: "gemini-2.5-flash-lite",
    systemInstruction: systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.7,
    },
  });

  // Start the chat session so it remembers history
  let chatSession = model.startChat({
    history: [],
  });

  var active = true
  send_button.onclick = () => {
    if (active && user_message.value.trim() !== "") {
      send_button.disabled = true
      active = false

      // get user message
      var message = user_message.value
      user_message.value = ""
      user_message.dataset.replicatedValue = ""

      // add user message to screen
      add_message(message, false)

      // indicate response is being written
      setTimeout(async () => {
        add_typing()

        try {
          const result = await chatSession.sendMessage(message);
          const responseText = result.response.text();
          const aiResponse = JSON.parse(responseText);
          remove_typing();

          add_message(aiResponse.spanishMessage, true, aiResponse.englishTranslation);

          if (aiResponse.feedbackHtml) {
            add_analysis(`<h3>Feedback</h3>${aiResponse.feedbackHtml}`);
          }

          if (aiResponse.newVocabularyHtml && aiResponse.newVocabularyHtml.trim() !== "") {
            add_analysis(`<h3>New Vocabulary</h3>${aiResponse.newVocabularyHtml}`);
          }

        } catch {
          console.error("Error communicating with Gemini:", error);
          remove_typing();
          add_message("Lo siento, hubo un error.", true, "Sorry, there was an error.");

        } finally {
          send_button.disabled = false;
          active = true;
          user_message.focus();

        }

      }, 700)
    }
  }

  const initConversation = async () => {
    add_typing();
    try {
      const result = await chatSession.sendMessage(`
    You are a bilingual Spanish/English tutor. (your name is a sexy male spanish name) You have TWO distinct roles in every response:
    
    ROLE 1: The Conversation Partner (Strictly Spanish)
    - Converse with the user naturally in Spanish in the 'spanishMessage' field.
    - Primarily use this known vocabulary: ${learned_notes}.
    - Ask questions to keep the conversation flowing.
    - Occasionally introduce new words to push their skills.
    
    ROLE 2: The Language Analyst (Strictly English)
    - You MUST write the 'feedbackHtml' and 'newVocabularyHtml' fields ENTIRELY IN ENGLISH. 
    - You may use Spanish in these fields ONLY to quote the user or cite specific words (e.g., "You said 'el agua' which is correct...").
    - Always analyze the user's previous response in 'feedbackHtml'. Correct spelling/grammar, suggest more native-sounding phrasing, or encourage them.
    - If you introduced new words in ROLE 1, explain them in 'newVocabularyHtml' in English. Include root infinitive and tense for verbs.
    - Format both HTML fields using basic tags (<b>, <i>, <ul>, <li>, <br>).

    prompt a new conversation that will help the user learn
  
        `);
      const responseText = result.response.text();
      const aiResponse = JSON.parse(responseText);

      remove_typing();
      add_message(aiResponse.spanishMessage, true, aiResponse.englishTranslation);

      if (aiResponse.newVocabularyHtml) {
        add_analysis(`<h3>New Vocabulary</h3>${aiResponse.newVocabularyHtml}`);
      }
    } catch (e) {
      console.error("Init error", e);
      remove_typing();
    }
  };

  initConversation()
}

window.main = main