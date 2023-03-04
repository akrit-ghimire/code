const speech = {
    recognition: null,
    recognition_result: null,
    listen: () => {
        return new Promise((resolve) => {
            speech.recognition.start()
            speech.recognition.addEventListener('end', () => {
                resolve(speech.recognition_result)
            })
        })
    },
    speak: async (text) => {
        return new Promise((resolve) => {
            const msg = new SpeechSynthesisUtterance()
            msg.text = text
            speechSynthesis.speak(msg)
            msg.onend = () => {
                resolve()
            }
        })
    },
    init: (element) => {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        speech.recognition = new window.SpeechRecognition
        speech.recognition.interimResults = true

        speech.recognition.addEventListener('result', (e) => {
            const text = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')
        
            element.innerText = text
            speech.recognition_result = text
        })
    }
}


