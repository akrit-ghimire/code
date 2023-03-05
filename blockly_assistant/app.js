const btns = {
    save: document.getElementById('save_btn'),
    load: document.getElementById('load_btn'),
    new: document.getElementById('new_btn'),
    run: document.getElementById('run_btn'),
    close: document.getElementById('close_btn'),
    chat_mode: document.getElementById('chat_mode_btn'),
    voice_mode: document.getElementById('voice_mode_btn'),
    submit: document.getElementById('submit_btn'),
    welcome: document.getElementById('welcome')
}
const pages = {
    welcome: document.getElementById('welcome'),
    workspace: document.getElementById('workspace_page'),
    select_mode: document.getElementById('select_mode'),
    voice_mode: document.getElementById('voice_mode'),
    chat_mode: document.getElementById('chat_mode')
}
const text_input = document.getElementById('input')
const code_iframe = document.getElementById('code_iframe')

app = {
    mode: null,
    running: false,
    controls: {
        print: async (message) => {
            if (app.mode == 'chat') {
                await app.chat_mode.add_message('va', message)
            } else {
                await app.controls.speak(message)
            }
        },
        get_input: async () => {
            if (app.mode == 'chat') {
                return new Promise((resolve) => {
                    const send_from_text_input = () => {
                        if (text_input.value.length > 0) {
                            const message = text_input.value
                            text_input.value = ''

                            btns.submit.removeEventListener('click', send_from_text_input)
                            // text_input.removeEventListener('keypress', send_from_text_input)
                            app.chat_mode.disable_chat()
                            app.chat_mode.add_message('user', message)
                            resolve(message)
                        }
                    }
                    app.chat_mode.enable_chat()
                    btns.submit.addEventListener('click', send_from_text_input)
                    // text_input.addEventListener('keypress', (e) => {
                    //     if (e.key == 'Enter') {
                    //         send_from_text_input()
                    //     }
                    // })
                })
            } else {
                return await app.controls.listen()
            }
        },
        listen: async () => {
            app.voice_mode.listen()
            const listened_text = await speech.listen()
            app.voice_mode.inactive()
            return listened_text
        },
        speak: async (text) => {
            app.voice_mode.speak()
            await speech.speak(text)
            app.voice_mode.inactive()
        }
    },
    switch_page: (page) => {
        pages.workspace.style.display = 'none'
        pages.select_mode.style.display = 'none'
        pages.voice_mode.style.display = 'none'
        pages.chat_mode.style.display = 'none'
        pages.welcome.style.display = 'none'
        btns.close.style.display = 'none'

        page.style.display = 'flex'
        if (page !== pages.workspace && page !== pages.welcome) {
            btns.close.style.display = 'flex'
        } else {
            eval() // hopefully clears any ongoing scripts
        }
    },
    chat_mode: {
        messages_group: document.getElementById('messages_group'),

        calculate_typing_time: (message) => {
            // make typing animation more dynamic to text being sent
            let type_time
            if (message.length > 40) type_time = 4000
            else type_time = 2000
            return type_time
        },

        add_message: (type, message) => {
            // return promise to ensure that any animations are complete before next text
            return new Promise((resolve) => {
                if (type == 'user') {
                    messages_group.insertAdjacentHTML('afterBegin', `
                        <div class="user_message">
                            <p>Sent @ ${new Date().toLocaleTimeString()}</p>
                            <p>${message}</p>
                        </div>
                    `)
                    resolve()
                } else {
                    // typing message animation
                    const message_div = document.createElement('div')
                    message_div.classList.add('va_message', 'typing')
                    message_div.innerHTML = `
                        <span class="circle bouncing"></span>
                        <span class="circle bouncing"></span>
                        <span class="circle bouncing"></span>
                    `
                    messages_group.insertAdjacentElement('afterbegin', message_div)
                    setTimeout(() => {
                        message_div.classList.remove('typing') // remove animation and replace with message
                        message_div.innerHTML = `
                            <p>Sent @ ${new Date().toLocaleTimeString()}</p>
                            <p>${message}</p>
                        `
                        resolve()
                    }, app.chat_mode.calculate_typing_time(message))
                }
            })
        },
        clear_chat: () => {
            app.chat_mode.messages_group.innerHTML = ''
        },
        disable_chat: () => {
            btns.submit.disabled = true
            text_input.disabled = true
            btns.submit.querySelector('i').innerText = 'block'
        },
        enable_chat: () => {
            btns.submit.disabled = false
            text_input.disabled = false
            btns.submit.querySelector('i').innerText = 'send'
        }
    },
    voice_mode: {
        indicator: document.getElementById('indicator'),
        indicator_icon: document.getElementById('indicator_icon'),
        indicator_text: document.getElementById('indicator_listened_text'),
        clear_text: () => {
            app.voice_mode.indicator_text.innerText = ''
        },
        listen: () => {
            app.voice_mode.indicator.classList.add('pink_pulse')
            app.voice_mode.indicator.classList.remove('indicator_speaking')
            app.voice_mode.indicator.classList.remove('inactive')
            app.voice_mode.indicator_icon.innerText = 'mic'
            app.voice_mode.clear_text()
        },
        speak: () => {
            app.voice_mode.indicator.classList.add('indicator_speaking')
            app.voice_mode.indicator.classList.remove('pink_pulse')
            app.voice_mode.indicator.classList.remove('inactive')
            app.voice_mode.indicator_icon.innerText = 'graphic_eq'
            app.voice_mode.clear_text()
        },
        inactive: () => {
            app.voice_mode.indicator.classList.add('inactive')
            app.voice_mode.indicator.classList.remove('indicator_speaking')
            app.voice_mode.indicator.classList.remove('pink_pulse')
            app.voice_mode.indicator_icon.innerText = 'mic_off'
            app.voice_mode.clear_text()
        }
    },
    run_code: () => {
        user_notification.toast(`Your app is now running in ${app.mode} mode.`)
        const code = Blockly.JavaScript.workspaceToCode(workspace)
        const iframe = document.createElement('iframe')
        iframe.sandbox = "allow-scripts allow-same-origin"
        iframe.srcdoc = `<html><head></head><body><script>const app = window.top.app;${code};main()</script></body></html>`
        code_iframe.append(iframe)
    },
    file_system: {
        save_code: () => {
            const json = Blockly.serialization.workspaces.save(workspace);
            let file_name = prompt('File name:') || 'blockly_assistant_file_save'
            file_management.save_file(file_name, 'akrit', json)
        },
        load_code: async () => {
            const json = await file_management.get_file('akrit')
            Blockly.serialization.workspaces.load(json, workspace);
            user_notification.toast('Successfully loaded file!')
        },
        clear_code: () => {
            const response = confirm("Are you sure you want to create a new workspace? This will delete any unsaved work.");
            if (response == true) {
                Blockly.getMainWorkspace().clear()
            }
            user_notification.toast('Successfully created new file!')
        },
    },
    init: () => {
        document.body.style.height = `${window.innerHeight}px` // fix height issues for mobile devices
        document.body.addEventListener('resize', () => {
            document.body.style.height = `${window.innerHeight}px` // fix height issues for mobile devices
        })

        speech.init(app.voice_mode.indicator_text) // for indicator text

        app.switch_page(pages.welcome)
        btns.save.addEventListener('click', () => {
            app.file_system.save_code()
        })
        btns.load.addEventListener('click', () => {
            app.file_system.load_code()
        })
        btns.new.addEventListener('click', () => {
            app.file_system.clear_code()
        })
        btns.run.addEventListener('click', () => {
            app.switch_page(pages.select_mode)
        })
        btns.welcome.addEventListener('click', () => {
            app.switch_page(pages.workspace)
            onresize() // init workspace
        })
        btns.close.addEventListener('click', () => {
            const iframe = code_iframe.querySelector('iframe')
            if (iframe) {
                iframe.srcdoc = ''
                code_iframe.removeChild(iframe)
            }
            app.switch_page(pages.workspace)
        })
        btns.chat_mode.addEventListener('click', () => {
            app.mode = 'chat'
            app.switch_page(pages.chat_mode)
            app.chat_mode.clear_chat()
            app.run_code()
        })
        btns.voice_mode.addEventListener('click', () => {
            app.mode = 'voice'
            app.switch_page(pages.voice_mode)
            app.voice_mode.clear_text()
            app.run_code()
        })
    }
}
app.init()
