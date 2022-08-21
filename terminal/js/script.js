const StandardKeyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: [],
        textarea: document.querySelector('#editor')
    },
    eventHandlers: {
        oninput: (value_to_set_input, self) => {
            self.elements.textarea.textContent = value_to_set_input
            self.elements.textarea.focus()
            // self.elements.textarea.selectionStart = self.properties.selectionStart
            // self.elements.textarea.selectionEnd = self.properties.selectionEnd
        },
    },
    properties: {
        value: "",
        capsLock: false,
        selectionStart: 1,
        selectionEnd: 1
    },
    init() {
        // Create main elements
        this.elements.main = document.createElement("div")
        this.elements.keysContainer = document.createElement("div")

        // Setup main elements
        this.elements.main.classList.add("keyboard", "py-1")
        this.elements.keysContainer.classList.add("keyboard_keys")
        this.elements.keysContainer.appendChild(this._createKeys())

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard_key')

        this.elements.textarea.addEventListener("keydown", ()=> {
            this.properties.value = this.elements.textarea.value
            this.properties.selectionStart = this.elements.textarea.selectionStart
            this.properties.selectionEnd = this.elements.textarea.selectionEnd
            console.log(this.properties.selectionStart, this.properties.selectionEnd)
        })

        // Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer)
        document.querySelector('#keyboard').append(this.elements.main)
    },
    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "change", 
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "tab", "a", "s", "d", "f", "g", "h", "j", "k", "l","backspace",
            "caps","z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "enter",
            "down","up","space","left","right",
        ]

        // Create HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`
        }

        // Loop
        keyLayout.forEach(key => {
            const keyElement = document.createElement("div")
            const insertLineBreakAt = ["change", "p", "backspace", "enter"].indexOf(key) !== -1;

            // Add classes
            keyElement.classList.add('keyboard_key')

            switch (key) {
                case "change":
                    keyElement.classList.add('keyboard_key--wide')
                    keyElement.innerHTML = createIconHTML("numbers")
                    // add event listeners
                    break;
                case "backspace":
                    keyElement.classList.add('keyboard_key--wide')
                    keyElement.innerHTML = createIconHTML("backspace")
                    keyElement.addEventListener("click", () => {
                        const currentValue = this.properties.value;
                        const currentStartPos = this.elements.textarea.selectionStart
                        const currentEndPos = this.elements.textarea.selectionEnd 
                        console.log(currentStartPos, currentEndPos)
                        let newValue = currentValue.slice(0, currentStartPos-1) + currentValue.slice(currentEndPos, currentValue.length - currentEndPos-currentStartPos);
                        this.properties.value = newValue
                        console.log(newValue)
                        this._triggerEvent('oninput')
                    })
                    break;
                case "caps":
                    keyElement.classList.add('keyboard_key--wide', 'keyboard_key--activatable')
                    keyElement.innerHTML = createIconHTML("keyboard_capslock")
                    // add event listeners
                    keyElement.addEventListener("click", () => {
                        this._toggleCapsLock()
                        keyElement.classList.toggle("keyboard_key--active", this.properties.capsLock)
                    })
                    break;
                case "enter":
                    keyElement.classList.add('keyboard_key--wide', "keyboard_key--vibrant")
                    keyElement.innerHTML = createIconHTML("keyboard_return")
                    // add event listeners
                    keyElement.addEventListener("click", () => {
                        // add "\n"
                        this.properties.value += "\n"
                        this.properties.selectionStart += 1
                        this.properties.selectionEnd += 1
                        this._triggerEvent('oninput')
                    })
                    break;
                case "space":
                    keyElement.classList.add('keyboard_key--extra-wide')
                    keyElement.innerHTML = createIconHTML("space_bar")
                    // add event listeners
                    keyElement.addEventListener("click", () => {
                        // add " "
                        this.properties.value += " "
                        this.properties.selectionStart += 1
                        this.properties.selectionEnd += 1
                        this._triggerEvent('oninput')
                    })
                    break;
                case "tab":
                    keyElement.classList.add('keyboard_key--wide')
                    keyElement.innerHTML = createIconHTML("keyboard_tab")
                    // add event listeners
                    keyElement.addEventListener("click", () => {
                        // add "    "
                        this.properties.value += "    " // 4 spaces
                        this.properties.selectionStart += 4
                        this.properties.selectionEnd += 4
                        this._triggerEvent('oninput')
                    })
                    break;
                case "up":
                    keyElement.innerHTML = createIconHTML(`keyboard_arrow_${key}`)
                    keyElement.addEventListener("click", () => {
                        // move cursor
                    })
                    break;
                case "down":
                    keyElement.innerHTML = createIconHTML(`keyboard_arrow_${key}`)
                    keyElement.addEventListener("click", () => {
                        // move cursor
                    })
                    break;
                case "right":
                    keyElement.innerHTML = createIconHTML(`keyboard_arrow_${key}`)
                    keyElement.addEventListener("click", () => {
                        // move cursor
                        this.properties.selectionStart += 1
                        this.properties.selectionEnd += 1
                        this._triggerEvent('oninput')
                    })
                    break;
                case "left":
                    keyElement.innerHTML = createIconHTML(`keyboard_arrow_${key}`)
                    keyElement.addEventListener("click", () => {
                        // move cursor
                        this.properties.selectionStart -= 1
                        this.properties.selectionEnd -= 1
                        this._triggerEvent('oninput')
                    })
                    break;
                default: // standard keys
                    keyElement.textContent = key.toLowerCase()
                    // add event listeners
                    keyElement.addEventListener("click", () => {
                        // add this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()
                        this.properties.selectionStart += 1
                        this.properties.selectionEnd += 1
                        this._triggerEvent('oninput')
                    })
                    break;
                
            }
            fragment.appendChild(keyElement)

            if (insertLineBreakAt) {
                fragment.appendChild(document.createElement('br'))
            }


        })

        return fragment

    },
    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock
        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase()
            }
        }

    },
    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value, this)
        }
    }
}
StandardKeyboard.init()