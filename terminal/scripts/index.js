// BUTTONS
const save_btn = document.getElementById('save_btn')
const load_btn = document.getElementById('load_btn')
const new_btn = document.getElementById('new_btn')
const run_btn = document.getElementById('run_btn')
const tutorial_btn = document.getElementById('tutorial_btn')
const menu_btn = document.getElementById('menu_btn')
const forward_btn = document.getElementById('forward_btn')
const backward_btn = document.getElementById('backward_btn')
const close_btn = document.getElementById('close_btn')
// PAGES
const run_page = document.getElementById('run-page')
const code_page = document.getElementById('code-page')
const tutorial_page = document.getElementById('help-page')
// SUB PAGES
const menu_sub_page = document.getElementById('menu-sub-page')
const article_sub_page = document.getElementById('article-sub-page')
// CONTROL BAR
const cb_hint = document.getElementById('cb-hint')
const cb_controls = document.getElementById('cb-controls')
const page_indicator = document.getElementById('page_indicator')
// MISC
const textarea = document.querySelector('textarea')
const lesson_list = document.querySelector('lesson-list')
const ide = document.getElementById('ide')
const control_bar = document.getElementById('control-bar')
const title = document.getElementById('title')
const icon = document.getElementById('icon')
// SCRIPT
const app = {
    icon: (name) => `<i class="material-icons">${name}</i>`,
    data: {
        iframe: null,
        code: '',
    },
    alter_meta: () => {
        let extracted_title_elem = app.data.iframe.contentDocument.querySelector('title')
        if (extracted_title_elem) title.innerText = extracted_title_elem.innerText
        let extracted_icon_elem = app.data.iframe.contentDocument.querySelector('link[rel=icon]')
        if (extracted_icon_elem) icon.href = extracted_icon_elem.href
    },
    open: {
        run_page: () => {
            ide.style.display = 'none'
            run_page.style.display = 'block'
            // create iframe and append to runpage
            app.data.iframe = document.createElement('iframe')
            app.data.code = textarea.value
            app.data.iframe.srcdoc = app.data.code
            app.data.iframe.onload = app.alter_meta
            run_page.append(app.data.iframe)
        },
        ide: () => {
            ide.style.display = 'flex'
            run_page.style.display = 'none'
            if (app.data.iframe) { // delete iframe
                run_page.removeChild(app.data.iframe)
            }
            title.innerText = 'Terminal'
            icon.href = './data/logo.png'
        },
        tutorial: () => {
            tutorial_page.style.width = '100%'
            tutorial_btn.innerHTML = app.icon('close')
            app.dependant_padding()
        },
        menu: () => {
            cb_controls.style.display = 'none'
            cb_hint.style.display = 'block'
            menu_sub_page.style.display = 'flex'
            article_sub_page.style.display = 'none'
        },
        article: () => {
            cb_controls.style.display = 'flex'
            cb_hint.style.display = 'none'
            menu_sub_page.style.display = 'none'
            article_sub_page.style.display = 'block'
        },
        load: () => {
            if (window.confirm('Loading will delete any unsaved data!')) {
                // load file
                app.save()
                file_manager.load()
            }
        },
        save: () => {
            app.save()
            if (file_manager.file == null) file_manager.save_as()
            else file_manager.save() 
        },
        new: () => {
            if (window.confirm('Creating a new file will delete any unsaved data!')) {
                // load file
                textarea.value = ''
                app.data.code = ''
                file_manager.clear_file()
                app.notify('Successfully created new file!')
            }
        }
    },
    close: {
        tutorial: () => {
            tutorial_page.style.width = '0%'
            tutorial_btn.innerText = 'Tutorials'
            app.dependant_padding()
        }
    },
    toggle: {
        state: {
            tutorial: false
        },
        tutorial: () => {
            if (app.toggle.state.tutorial) {
                app.toggle.state.tutorial = false
                app.close.tutorial()
            } else {
                app.toggle.state.tutorial = true
                app.open.tutorial()
            }
        }
    },
    loader: {
        pages: [],
        slide_elems: [],
        slide: 0,
        slide_length: 0,
        tutorial_name: null,
        import: (title, src) => {
            app.loader.pages.push({title, src})
        },
        create_link: ({title, src}, index) => `
            <lesson onclick="app.loader.load_page( '${title}', '${src}')">
                <p>${index}. ${title}</p>
                <span><i class="material-icons">start</i></span>
            </lesson>
        `,
        load_page: (title, src) => {
            app.open.article()
            md.read(src)
            app.loader.tutorial_name = title
            app.loader.slide = 0
            app.loader.slide_elems = Array.from(document.querySelectorAll('[data-page]'))
            app.loader.slide_length = app.loader.slide_elems.length
            app.loader.page_back() // ensures starts at 0
        },
        load_menu: () => {
            app.loader.pages.forEach((page, index) => {
                lesson_list.insertAdjacentHTML('beforeend', app.loader.create_link(page, index+1))
            })
        },
        page_transition_pre: () => {
            app.loader.slide_elems[app.loader.slide].style.display = 'none' // hide current page
            forward_btn.disabled = false // reset buttons to default state
            backward_btn.disabled = false
        },
        page_transition_post: () => {
            app.loader.slide_elems[app.loader.slide].style.display = 'block' // show next page
            page_indicator.innerText = `${app.loader.slide+1} of ${app.loader.slide_length}`
            article_sub_page.scrollTo(0, 0) // scroll to top when next page clicked
        },
        page_next: () => {
            app.loader.page_transition_pre()

            app.loader.slide += 1
            if (app.loader.slide >= app.loader.slide_length) {
                app.loader.slide -= 1 // resets to previous value
                forward_btn.disabled = true
            }

            app.loader.page_transition_post()
        },
        page_back: () => {
            app.loader.page_transition_pre()

            app.loader.slide -= 1
            if (app.loader.slide < 0) {
                app.loader.slide = 0
                backward_btn.disabled = true
            }

            app.loader.page_transition_post()
        }
    },
    tutorial_complete: () => {
        app.open.menu()
        app.notify('Congrats! You completed ' + app.loader.tutorial_name)
    },
    notify: (message) => {
        const existingToasts = Array.from(document.querySelectorAll('toast'))
        let shouldCreate = true
        existingToasts.forEach(toast => {
            if (toast.innerText == message) shouldCreate = false
        })
        if (shouldCreate) {
            const toast = document.createElement('toast')
            toast.innerText = message
            document.body.append(toast)
            setTimeout(() => {document.body.removeChild(toast)}, 5000)
        }
    },
    save: () => {
        app.data.code = textarea.value
    },
    dependant_padding: () => {
        if (window.innerWidth > 900 && app.toggle.state.tutorial !== true) {
            code_page.style.paddingLeft = '16vw'
            code_page.style.paddingRight = '16vw'
        } else {
            code_page.style.paddingLeft = '1.5rem'
            code_page.style.paddingRight = '1.5rem'
        }
    },
    media_queries: () => {
        if (window.innerWidth < 1000) {
            tutorial_btn.disabled = true
            app.close.tutorial()
            app.toggle.state.tutorial = false
            app.notify('Tutorial disabled: Browser too small.')
        } else {
            tutorial_btn.disabled = false
        }
        app.dependant_padding()
    },
    init: () => {
        app.open.ide()
        app.open.menu()
        app.close.tutorial()
        app.media_queries()
        // eventlisteners
        run_btn.addEventListener('click', app.open.run_page)
        close_btn.addEventListener('click', app.open.ide)
        tutorial_btn.addEventListener('click', app.toggle.tutorial)
        menu_btn.addEventListener('click', app.open.menu)
        forward_btn.addEventListener('click', app.loader.page_next)
        backward_btn.addEventListener('click', app.loader.page_back)
        load_btn.addEventListener('click', app.open.load)
        save_btn.addEventListener('click', app.open.save)
        new_btn.addEventListener('click', app.open.new)

        window.addEventListener('resize', (_) => {
            app.media_queries()
        })
        // not sure how to make this work
        // textarea.addEventListener('keydown', (e) => { 
        //     if (e.key == "Tab") {
        //         e.preventDefault()
        //         const text = textarea.value
        //         const altered = text.slice(0, textarea.selectionStart) + '    ' + text.slice(textarea.selectionEnd, text.length)
        //         textarea.value = altered
        //         textarea.selectionEnd -= 4
        //         app.save()
        //     }
        // })
    }
}
app.init()