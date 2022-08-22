const state = {
    props: {
        // upon change these will all fire events
        projectName: 'NewProject',
        currentEditor: null,
        hideCommand: false,
        data: {
            "html": "<!-- This is a comment in HTML -->",
            "css": "/* This is a comment in CSS */",
            "js": "// This is a comment in JS"
        },
    },
    eventHandling: {
        currentEditorUpdate: function (previousValue) {
            // Update Tabs
            Array.from(document.querySelectorAll('[data-current-editor-subscriber]')).forEach(element => {
                const name = element.querySelector('span').textContent
                const isActive = name == state.props.currentEditor
                if (isActive) {
                    element.classList.remove('fill-n')
                    element.classList.add('fill-a')
                } else {
                    element.classList.remove('fill-a')
                    element.classList.add('fill-n')
                }
            })
            // Save Editor
            state.editorFunctions.saveEditor(previousValue)
            // Update Editor
            state.editorFunctions.loadEditor()


        },
        hideCommandUpdate: function (_) {
            // hide control elements
            Array.from(document.querySelectorAll('[data-hide-command-subscriber]')).forEach(element => {
                element.style.display = state.props.hideCommand ? 'none' : 'flex'
            })
            if (state.props.hideCommand) {
                state.keyboardFunctions._hideKeyboard()
            } else {
                state.keyboardFunctions._showKeyboard()
            }
        }
    },
    editorFunctions: {
        data: {
            editor: document.querySelector('#editor'),
            startPos: 0,
            endPos: 0,
        },
        updateSelection: () => {
            const editorData = state.editorFunctions.data
            editorData.startPos = editorData.editor.selectionStart
            editorData.endPos = editorData.editor.selectionEnd
            state.editorFunctions.focusEditor()
        },
        addCharacters: (characters) => {
            const startPos = state.editorFunctions.data.startPos
            const endPos = state.editorFunctions.data.endPos
            const editor = state.editorFunctions.data.editor
            const value = editor.value
            editor.value = value.slice(0, startPos) + characters + value.slice(endPos, value.length)
            // update selection
            editor.selectionStart = startPos + characters.length
            editor.selectionEnd = endPos +characters.length
            state.editorFunctions.updateSelection()
            
        },
        deleteCharacters: () => {
            const startPos = state.editorFunctions.data.startPos
            const endPos = state.editorFunctions.data.endPos
            const editor = state.editorFunctions.data.editor
            const value = editor.value
            editor.value = value.slice(0, startPos-1) + value.slice(endPos, value.length)
            // update selection
            editor.selectionStart = startPos -1
            editor.selectionEnd = endPos -1
            state.editorFunctions.updateSelection()
            
        },
        createLinkTabs: () => {
            const leftTabs = document.querySelector('#left-tabs')
            leftTabs.innerHTML = ''
            Object.entries(state.props.data).forEach(dataArr => {
                const name = dataArr[0]

                const tabContainer = document.createElement('div')
                tabContainer.dataset.currentEditorSubscriber = ''
                tabContainer.dataset.hideCommandSubscriber = ''
                tabContainer.classList.add("tab", "px-2", "hover")

                const text = document.createElement('span')
                text.textContent = name

                tabContainer.appendChild(text)
                leftTabs.appendChild(tabContainer)


                tabContainer.addEventListener("click", () => {
                    state.setState('currentEditor', name)
                })
            })
            state.setState('currentEditor', 'html') // default screen
        },
        saveEditor: (editorScreenName) => {
            const newData = state.props.data
            newData[editorScreenName] = state.editorFunctions.data.editor.value
            state.setState('data', newData)
        },
        loadEditor: () => {
            const editor = state.editorFunctions.data.editor
            editor.disabled = false
            editor.value = state.props.data[state.props.currentEditor]
        },
        focusEditor: (cursorAdjustSize) => {
            state.editorFunctions.data.editor.focus()
            // change cursor position
        }
    },
    runScriptFunctions: {
        data: {
            splashHTML: '<!-- HTML, CSS & JS files collated with AkritBox (Sandbox Software) -->',
            cssReference: '<link href="./styles.css" rel="stylesheet">',
            jsReference: '<script src="./script.js"></script>',
            jsConsoleHeaderFile: `
                document.head.innerHTML = "<style>:root {--color-vibrant-1: #ea1f63;}body {font-size: calc(20px*1.05);color: var(--color-vibrant-1);font-family: sans-serif;}::-webkit-scrollbar { width: 10px; }::-webkit-scrollbar-track { background: var(--color-dark-light); }::-webkit-scrollbar-thumb { background: var(--color-dark-contrast); }::-webkit-scrollbar-thumb:hover { background: var(--color-vibrant-1); }</style>"
                document.write('Your Javascript file is now running!')
                console = {
                    log: function(m){
                        document.head.innerHTML = "<style>:root {--color-vibrant-1: #ea1f63;}body {font-size: calc(20px*1.05);color: var(--color-vibrant-1);font-family: sans-serif;} ::-webkit-scrollbar { width: 10px; } ::-webkit-scrollbar-track { background: var(--color-dark-light); } ::-webkit-scrollbar-thumb { background: var(--color-dark-contrast); } ::-webkit-scrollbar-thumb:hover { background: var(--color-vibrant-1); }</style>"
                        document.write('<br>'+m)
                    }       
                };
            `,
            runningConsole: false
        },
        filterHTML: () => {
            return state.props.data.html.replace(/\n/, "")
        },
        filterCSS: () => {
            return state.props.data.css.replace(/\n/, "")
        },
        filterJS: (putConsoleAlterations) => {
            const consoleHeader = putConsoleAlterations ? state.runScriptFunctions.data.jsConsoleHeaderFile : ''
            return consoleHeader + state.props.data.js.replace(/\n/, ";")
        },
        createWebsite: (mode = 'dev') => {
            console.log(mode)
            const cssReference = state.runScriptFunctions.data.cssReference
            const jsReference = state.runScriptFunctions.data.jsReference
            const splashHTML = state.runScriptFunctions.data.splashHTML
            let html = state.runScriptFunctions.filterHTML()
            if (html.search(cssReference > -1)) {
                html = html.replace(cssReference, `
                    <!--${cssReference}-->
                    <!-- For External stylesheets, uncomment the above and put the styles (from below) in a separate style sheet (.css) named accordingly-->
                    <style>${state.runScriptFunctions.filterCSS()}</style>
                `)
            }
            if (html.search(jsReference > -1)) {
                html = html.replace(jsReference, `
                    <!--${jsReference}-->
                    <!-- For External javascript files, uncomment the above and put the script (from below) in a separate js script file (.js) named accordingly-->
                    <script defer>${state.runScriptFunctions.filterJS(mode == 'dev')}</script>
                `)
            }
            return html + splashHTML
        },
        runConsole: () => {
            state.setState('hideCommand', true)
            state.editorFunctions.saveEditor(state.props.currentEditor)
            state.runScriptFunctions.data.runningConsole = true

            const editor = state.editorFunctions.data.editor
            editor.disabled = true
            editor.value = 'Your JS Script is now running!'

            // Create Console Tab Bar
            const consoleTab = () => {
                const left = document.querySelector('#left-tabs')
                const right = document.querySelector('#right-tabs')

                const blinkingText = document.createElement('div')
                blinkingText.classList.add("tab", "px-2", "fill-n")
                blinkingText.insertAdjacentHTML('beforeend', '<span class="blinking">Running...</span>')
                left.appendChild(blinkingText)

                const closeButton = document.createElement('div')
                closeButton.classList.add("tab", "px-2", "hover", "fill-a")
                closeButton.insertAdjacentHTML('beforeend', '<span><i class="material-icons">close</i><span>')
                right.appendChild(closeButton)

                // create iframe sandbox
                const iframe = document.createElement('iframe')
                iframe.sandbox.add('allow-scripts')
                iframe.sandbox.add('allow-modals')
                iframe.sandbox.add('allow-popups')
                iframe.classList.add('outline', 'px-1', 'py-1')
                iframe.srcdoc = `
                    <!DOCTYPE html>
                    <html>
                        <head>
                            <script defer>${state.runScriptFunctions.filterJS(true)}</script>
                        </head>
                        <body></body>
                    </html>
                `
                // iframe.style.display = 'none'
                document.querySelector('#body-area').append(iframe)

                // // listen for console.logs -- depracated
                // window.addEventListener("message", (event) => {
                //     const editor = state.editorFunctions.data.editor
                //     const type = event.data.type
                //     const message = event.data.message
                //     if (type == 'log') {
                //         editor.value += `\n${message}`
                //     }
                //     if (type == 'warn') {
                //         editor.value += `\n<u>${message}</u>`
                //     }
                //     console.log(event.data)
                // });

                const destroyConsoleServer = () => {
                    state.runScriptFunctions.data.runningConsole = false
                    iframe.srcdoc = ''
                    // state.enterFullScreen()
                    document.querySelector('#body-area').removeChild(iframe)
                    left.removeChild(blinkingText)
                    right.removeChild(closeButton)
                    state.editorFunctions.loadEditor() // trigger a refresh of the console.
                }

                closeButton.addEventListener("click", () => {
                    destroyConsoleServer()
                    state.setState('hideCommand', false)
                })
            }
            consoleTab()
        },
        runWebsite: () => {
            state.setState('hideCommand', true)
            state.editorFunctions.saveEditor(state.props.currentEditor)

            const hideWindow = () => {
                document.querySelector('#window').style.display = 'none'

                const closeButton = document.createElement('div')
                closeButton.classList.add("tab", "px-2", "hover", "fill-a")
                closeButton.insertAdjacentHTML('beforeend', '<span><i class="material-icons">close</i><span>')
                document.body.appendChild(closeButton)
                closeButton.style.position = 'absolute'
                // positions are uncommon for most ui elements
                closeButton.style.bottom = '4px'
                closeButton.style.left = '4px'
                // other styles
                closeButton.style.width = '3rem'
                closeButton.style.height = '3rem'
                closeButton.style.opacity = '0.3'
                closeButton.style.textAlign = 'center'
                closeButton.style.zIndex = '9999'
                closeButton.style.padding = '0'


                // create iframe sandbox
                const iframe = document.createElement('iframe')
                iframe.sandbox.add('allow-scripts')
                iframe.sandbox.add('allow-modals')
                iframe.sandbox.add('allow-popups')
                iframe.srcdoc = state.runScriptFunctions.createWebsite()
                iframe.id = 'iframe'
                document.body.append(iframe)



                const destroyWebsiteServer = () => {
                    document.body.removeChild(closeButton)
                    document.body.removeChild(iframe)
                    // state.enterFullScreen()
                    document.querySelector('#window').style.display = 'grid'
                    state.editorFunctions.loadEditor() // trigger a refresh of the console.
                }

                closeButton.addEventListener("click", () => {
                    destroyWebsiteServer()
                    state.setState('hideCommand', false)
                })
            }
            hideWindow()
        },
    },
    controlFunctions: {
        new: () => {
            const dataDefault = {
                "html": "<!-- This is a comment in HTML -->",
                "css": "/* This is a comment in CSS */",
                "js": "// This is a comment in JS"
            }
            const confirmation = JSON.stringify(state.props.data) !== JSON.stringify(dataDefault) ? confirm("Do you wish to overwrite your current project?") : true
            if (confirmation) {
                state.setState('data', dataDefault)
                state.editorFunctions.loadEditor()
                state.editorFunctions.createLinkTabs()
                state.menuFunctions.hideMenu()
            }
            // state.enterFullScreen()
        },
        load: () => {
            state.fileFunctions.getFile()
        },
        save: () => {
            state.fileFunctions.saveToFile()
            state.menuFunctions.hideMenu()
        },
        export: () => {
            state.fileFunctions.exportToFile()
            state.menuFunctions.hideMenu()
        },
        back: () => {
            state.menuFunctions.hideMenu()
        },
    },
    menuFunctions: {
        data: {
            menuElements: {
                base: function (isActive, htmlContent) {
                    // Create a standard menu element and customize
                    const baseOption = document.createElement('div')
                    const fill = isActive ? "fill-a" : "fill-n"
                    baseOption.classList.add("tab", "px-4", fill, "hover")
                    const span = document.createElement('span')
                    span.insertAdjacentHTML('beforeend', htmlContent)
                    baseOption.append(span)
                    return baseOption
                },
                new: function () {
                    return this.base(true, 'New Project&nbsp;<i class="material-icons">code</i>')
                },
                load: function () {
                    return this.base(false, 'Load Project&nbsp;<i class="material-icons">file_upload</i>')
                },
                save: function () {
                    return this.base(false, 'Save Project&nbsp;<i class="material-icons">file_download</i>')
                },
                export: function () {
                    return this.base(false, 'Export Project&nbsp;<i class="material-icons">terminal</i>')
                },
                fullscreen: function () {
                    return this.base(false, 'Enter Fullscreen&nbsp;<i class="material-icons">fullscreen</i>')
                },
                back: function () {
                    return this.base(false, 'Go Back&nbsp;<i class="material-icons">undo</i>')
                },
            },
        },
        hideMenu: () => {
            const menu = document.querySelector('#menu')
            menu.innerHTML = ''
            menu.style.display = 'none'
            const window = document.querySelector('#window')
            window.style.display = 'grid'
        },
        createMenu: (new_op = null, load_op = null, save_op = null, export_op = null, fullscreen_op = null,back_op = null) => {
            const window = document.querySelector('#window')
            window.style.display = 'none'
            const menu = document.querySelector('#menu')
            menu.innerHTML = ''
            menu.style.display = 'grid'
            // push elements
            const logo = document.createElement('h1')
            logo.textContent = 'AkritBox'
            menu.append(logo)
            if (new_op) {
                menu.append(new_op)
                new_op.addEventListener('click', () => state.controlFunctions.new())
            }
            if (load_op) {
                menu.append(load_op)
                load_op.addEventListener('click', () => state.controlFunctions.load())
            }
            if (save_op) {
                menu.append(save_op)
                save_op.addEventListener('click', () => state.controlFunctions.save())
            }
            if (export_op) {
                menu.append(export_op)
                export_op.addEventListener('click', () => state.controlFunctions.export())
            }
            if (fullscreen_op) {
                menu.append(fullscreen_op)
                fullscreen_op.addEventListener('click', () => {
                    state.enterFullScreen(); 
                    state.menuFunctions.hideMenu();
                })
            }
            if (back_op) {
                menu.append(back_op)
                back_op.addEventListener('click', () => state.controlFunctions.back())
            }
        },
        createStartMenu: () => {
            const data = state.menuFunctions.data
            state.menuFunctions.createMenu(new_op = data.menuElements.new(), load_op = data.menuElements.load())
        },
        createEditorMenu: () => {
            const data = state.menuFunctions.data
            state.menuFunctions.createMenu(new_op = data.menuElements.new(), load_op = data.menuElements.load(), save_op = data.menuElements.save(), export_op = data.menuElements.export(), fullscreen_op = data.menuElements.fullscreen(),back_op = data.menuElements.back())
        }
    },
    fileFunctions: {
        data: {
            fileData: false,
        },
        saveToFile: () => {
            // save editor
            state.editorFunctions.saveEditor(state.props.currentEditor)

            const stateData = {
                projectName: state.props.projectName,
                data: state.props.data
            }
            const downloadProjectName = stateData.projectName.replace(/ /g, "")

            const aDownloadTag = document.createElement('a')
            const downloadData = new Blob([JSON.stringify(stateData)], { type: 'text/akrit' })
            aDownloadTag.href = URL.createObjectURL(downloadData)
            aDownloadTag.download = `${downloadProjectName}.akrit`
            aDownloadTag.click()
        },
        getFile: () => {
            const fileInput = document.createElement('input')
            fileInput.type = 'file'
            fileInput.accept = '.akrit'
            fileInput.onchange = () => {
                const validFile = [...fileInput.files].filter((file) =>
                    'text/akrit'.includes(file.type)
                );
                if (validFile.length > 0) {
                    const file = fileInput.files[0]
                    const fileReader = new FileReader()
                    fileReader.readAsText(file)
                    fileReader.addEventListener('load', (e) => {
                        // reformat file data to object
                        state.fileFunctions.data.fileData = JSON.parse(e.target.result)
                        // now call loadFromFile
                        state.fileFunctions.loadFromFile()
                    })
                } else {
                    // send error message bottom right
                }
            }
            fileInput.click()
        },
        loadFromFile: () => {
            // create fresh project
            state.controlFunctions.new()
            // ammend project with saved data
            const data = state.fileFunctions.data.fileData
            state.setState('projectName', data.projectName)
            state.setState('data', data.data)
            state.editorFunctions.loadEditor()
            // send confirmation message bottom right
        },
        exportToFile: () => {
            // save editor
            state.editorFunctions.saveEditor(state.props.currentEditor)

            const html = state.runScriptFunctions.createWebsite(mode = 'no-dev')

            const aDownloadTag = document.createElement('a')
            const downloadData = new Blob([html], { type: 'text/html' })
            aDownloadTag.href = URL.createObjectURL(downloadData)
            aDownloadTag.download = `${state.props.projectName}.html`
            aDownloadTag.click()
        }
    },
    keyboardFunctions: {
        data: {
            main: null,
            keysContainer: null,
            keys: [],
            capsLock: false,
            extraKeysIndex: 0,
            extraKeys: [
                {
                    titleIcon: 'numbers',
                    keys: [['1',''], ['2', ''], ['3', ''], ['4', ''], ['5', ''], ['6', ''], ['7', ''], ['8', ''], ['9', ''], ['0', '']]
                },
                {
                    titleIcon: 'calculate', // logic
                    keys: [['+', ''], ['-', ''], ['/', ''], ['*', ''], ['=', ''], ['==', ''], ['(', ''], [')', ''], ['|', ''], ['&', ''],]
                },
                {
                    titleIcon: 'format_paint', // css
                    keys: [['<', ''], ['>', ''],['%', ''], ['#', ''], ['!', ''], ['@', ''], [':', ''], [';', ''], ['{', ''], ['}', '']]
                },
                {
                    titleIcon: 'archive',
                    keys: [['const', 'keyboard_key--wide'], ['let', 'keyboard_key--wide'], ['var', 'keyboard_key--wide'], ['=', ''], [':', ''],['"', ''], ["'", ''], ['`', '']]
                },
                {
                    titleIcon: 'build_circle',
                    keys: [['<', ''], ['="', 'keyboard_key--wide'], ['"', ''], ['>', ''], ['</', 'keyboard_key--wide']]
                },
                {
                    titleIcon: 'info', // all the ways to comment
                    keys: [['/*', ''], ['*/', ''], ['//', ''], ['<!--', 'keyboard_key--wide'], ['-->', 'keyboard_key--wide']]
                }
            ]
        },
        keyboardEvents: {
            oninput: (characterToAdd, cursorAdjustSize) => {
                state.editorFunctions.data.editor.value += characterToAdd
                state.editorFunctions.focusEditor(cursorAdjustSize)
            }
        },
        init() {
            // Create main elements
            this.data.main = document.createElement("div")
            this.data.keysContainer = document.createElement("div")

            // Setup main elements
            this.data.main.classList.add("keyboard", "py-1")
            this.data.keysContainer.classList.add("keyboard_keys")
            this.data.keysContainer.appendChild(this._generateExtraKeys())
            this.data.keysContainer.appendChild(this._createKeys())

            
            this.data.keys = this.data.keysContainer.querySelectorAll('.keyboard_key')
            
            // Add to DOM
            this.data.main.appendChild(this.data.keysContainer)
            document.querySelector('#keyboard').append(this.data.main)

            state.keyboardFunctions._createExtraKeys()
            state.keyboardFunctions._showKeyboard()
        },
        _generateExtraKeys() {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < 11; i++) {
                const keyElement = document.createElement("div")
                keyElement.dataset.extrasKey = ''
                fragment.appendChild(keyElement)
                if (i < 10) {
                    keyElement.addEventListener('click', ()=> {
                        state.editorFunctions.addCharacters(keyElement.textContent)
                    })
                }
            }
            fragment.lastChild.id = 'clickListener'

            fragment.querySelector('#clickListener').addEventListener('click', () => {
                state.keyboardFunctions.data.extraKeysIndex += 1
                if (state.keyboardFunctions.data.extraKeysIndex > state.keyboardFunctions.data.extraKeys.length - 1) {
                    state.keyboardFunctions.data.extraKeysIndex = 0
                }
                state.keyboardFunctions._createExtraKeys()
                state.editorFunctions.focusEditor()
            })

            fragment.appendChild(document.createElement('br'))
            return fragment
        },
        _createExtraKeys() {
            const createIconHTML = (icon_name) => {
                return `<i class="material-icons">${icon_name}</i>`
            }
            const titleIcon = this.data.extraKeys[this.data.extraKeysIndex].titleIcon
            const keys = this.data.extraKeys[this.data.extraKeysIndex].keys

            const keyElements = Array.from(document.querySelectorAll('[data-extras-key]'))

            for (let i = 0; i < keyElements.length; i++) {
                const key = keyElements[i]
                key.classList.remove("keyboard_key", "keyboard_key--wide")
                key.innerHTML = ''
                key.style.display = 'none'
                if (i < keys.length) {
                    key.style.display = 'inline-flex'
                    key.classList.add("keyboard_key")
                    if (keys[i][1].length > 1) key.classList.add(keys[i][1]) // the class list extra
                    key.textContent = keys[i][0] // the text
                } else if (key.id == 'clickListener') {
                    key.style.display = 'inline-flex'
                    key.classList.add("keyboard_key", "keyboard_key--vibrant")
                    key.innerHTML = createIconHTML(titleIcon) // the text
                }
            }
        },
        _createKeys() {
            const fragment = document.createDocumentFragment();
            const keyLayout = [
                "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
                "tab", "a", "s", "d", "f", "g", "h", "j", "k", "l", "backspace",
                "caps", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "enter",
                "left", "space", "right",
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
                    case "backspace":
                        keyElement.classList.add('keyboard_key--wide')
                        keyElement.innerHTML = createIconHTML("backspace")
                        keyElement.addEventListener("click", () => {
                            // const currentValue = this.properties.value;
                            // const currentStartPos = this.elements.textarea.selectionStart
                            // const currentEndPos = this.elements.textarea.selectionEnd
                            // console.log(currentStartPos, currentEndPos)
                            // let newValue = currentValue.slice(0, currentStartPos - 1) + currentValue.slice(currentEndPos, currentValue.length - currentEndPos - currentStartPos);
                            // this.properties.value = newValue
                            // console.log(newValue)
                            // this._triggerEvent('oninput')
                            state.editorFunctions.deleteCharacters('\n')
                        })
                        break;
                    case "caps":
                        keyElement.classList.add('keyboard_key--wide', 'keyboard_key--activatable')
                        keyElement.innerHTML = createIconHTML("keyboard_capslock")
                        // add event listeners
                        keyElement.addEventListener("click", () => {
                            this._toggleCapsLock()
                            keyElement.classList.toggle("keyboard_key--active", this.data.capsLock)
                            state.editorFunctions.focusEditor()
                        })
                        break;
                    case "enter":
                        keyElement.classList.add('keyboard_key--wide', "keyboard_key--vibrant")
                        keyElement.innerHTML = createIconHTML("keyboard_return")
                        // add event listeners
                        keyElement.addEventListener("click", () => {
                            // // add "\n"
                            state.editorFunctions.addCharacters('\n')
                        })
                        break;
                    case "space":
                        keyElement.classList.add('keyboard_key--extra-wide')
                        keyElement.innerHTML = createIconHTML("space_bar")
                        // add event listeners
                        keyElement.addEventListener("click", () => {
                            // // add " "
                            state.editorFunctions.addCharacters(' ')
                        })
                        break;
                    case "tab":
                        keyElement.classList.add('keyboard_key--wide')
                        keyElement.innerHTML = createIconHTML("keyboard_tab")
                        // add event listeners
                        keyElement.addEventListener("click", () => {
                            // // add "    "
                            state.editorFunctions.addCharacters('    ')
                        })
                        break;
                    case "right":
                        keyElement.innerHTML = createIconHTML(`keyboard_arrow_${key}`)
                        keyElement.addEventListener("click", () => {
                            // // move cursor
                            state.editorFunctions.data.editor.selectionStart += 1
                            state.editorFunctions.data.editor.selectionEnd += 0
                            state.editorFunctions.updateSelection()
                            state.editorFunctions.focusEditor()
                        })
                        break;
                    case "left":
                        keyElement.innerHTML = createIconHTML(`keyboard_arrow_${key}`)
                        keyElement.addEventListener("click", () => {
                            // // move cursor
                            // this.properties.selectionStart -= 1
                            // this.properties.selectionEnd -= 1
                            // this._triggerEvent('oninput')
                            state.editorFunctions.data.editor.selectionStart -= 1
                            state.editorFunctions.data.editor.selectionEnd -= 1
                            state.editorFunctions.updateSelection()
                            state.editorFunctions.focusEditor()
                        })
                        break;
                    default: // standard keys
                        keyElement.textContent = key.toLowerCase()
                        // add event listeners
                        keyElement.addEventListener("click", () => {
                            // // add this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()
                            // this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase()
                            state.editorFunctions.addCharacters(this.data.capsLock ? key.toUpperCase() : key.toLowerCase())
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
            this.data.capsLock = !this.data.capsLock
            for (const key of this.data.keys) {
                if (key.childElementCount === 0) {
                    key.textContent = this.data.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase()
                }
            }
        },
        _hideKeyboard() {
            state.keyboardFunctions.data.main.style.display = 'none'
        },
        _showKeyboard() {
            state.keyboardFunctions.data.main.style.display = 'block'
        }

    },
    setState(propName, propValue) {
        const previousValue = state.props[propName]
        state.props[propName] = propValue
        try {
            if (typeof state.eventHandling[`${propName}Update`] == "function") {
                state.eventHandling[`${propName}Update`](previousValue)
            }
        } catch {
            return
        }
    },
    enterFullScreen() {
        document.documentElement.requestFullscreen()
    },
    init() {
        state.menuFunctions.createStartMenu()
        const editorData = state.editorFunctions.data

        editorData.editor.addEventListener('keydown', (e) => {
            state.editorFunctions.updateSelection()
            if (e.keyCode == 9) {
                e.preventDefault() // prevent tab from leaving input field
                state.editorFunctions.addCharacters('    ')
                // now add tab space
            }
        })
        editorData.editor.addEventListener('click', (e) => {
            state.editorFunctions.updateSelection()
        })
        state.keyboardFunctions.init()
    }
}
state.init()
