const speech = {
    _speechSynth: null,
    _voices: null,
    _cache: {},



    // retries till voices are loaded
    loadVoicesWhenAvailable: (onComplete = () => { }) => {
        speech._speechSynth = window.speechSynthesis
        const voices = speech._speechSynth.getVoices()

        if (voices.length !== 0) {
            speech._voices = voices
            onComplete()
        } else {
            return setTimeout(() => { speech.loadVoicesWhenAvailable(onComplete) }, 100)
        }
    },
    // return first voice found in native language
    getVoices: (locale) => {
        if (!speech._speechSynth) {
            throw new Error('Browser does not support speech synthesis')
        }
        if (speech._cache[locale]) return speech._cache[locale]

        speech._cache[locale] = speech._voices.filter(voice => voice.lang === locale)
        return speech._cache[locale]
    },

    playByText: (locale, text, onEnd) => {
        const voices = speech.getVoices(locale)

        const utterance = new window.SpeechSynthesisUtterance()
        utterance.voice = voices[0]
        utterance.pitch = 1
        utterance.rate = 1
        utterance.voiceURI = 'native'
        utterance.volume = 1
        utterance.rate = 1
        utterance.pitch = 0.8
        utterance.text = text
        utterance.lang = locale

        if (onEnd) {
            utterance.onend = onEnd
        }

        speech._speechSynth.cancel() // cancel current speak, if any is running
        speech._speechSynth.speak(utterance)
    },


    speak: async (text) => {
        return new Promise((resolve) => {
            setTimeout(() => speech.playByText("en-US", text, () => {
                resolve()
            }), 300)
        })
    },

    recognition: null,
    recognition_result: null,
    listen: () => {
        return new Promise((resolve) => {
            speech.recognition.start()
            speech.recognition.onspeechend = () => {
                speech.recognition.stop()
            }
            speech.recognition.addEventListener('end', () => {
                speech.recognition.stop()
                let result = speech.recognition_result
                if (result == null) result = ''
                resolve(result)
            })
        })
    },
    init: (element) => {
        document.body.onload = () => {
            speech.loadVoicesWhenAvailable(/* Callback goes here */() => {
                if (user_notification) {
                    user_notification.toast('Chatbot voice has been loaded!')
                }
            })
        }

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

