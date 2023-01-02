import {
    renderRoot,
    renderComponent,
    setTitle,
    useState,
    setStyle,
    setIcon,
    useEvent
} from './libraries/MICRO-REACT-DOM.js'

import Editor from './components/Editor.js'
import Menu from './components/Menu.js'
import Emulator from './components/Emulator.js'

let tempEditorValue = '' // by default
let editor
let selectionStart = 0
let selectionEnd = 0

const defaultFileData = {
    'html': '<!--This is a comment, delete this if you want-->',
    'css': '/* This is a comment, delete this if you want */',
    'js': '/* This is a comment, delete this if you want */'
}

const App = name => () => {
    const [editorVisibility, setEditorVisibility] = useState(true)
    const [menuVisibility, setMenuVisibility] = useState(false)
    const [emulatorVisibility, setEmulatorVisibility] = useState(false)

    const [fileData, setFileData] = useState(defaultFileData)
    const [activeTab, setActiveTab] = useState('html')
    const setEditorData = () => {
        const editorData = fileData[activeTab]
        tempEditorValue = editorData
        return editorData
    }
    const [editorValue, setEditorValue] = useState(setEditorData())

    
    // Header Tab Functions
    const saveTab = () => {
        setFileData(prevData => {
            const newData = {...prevData}
            newData[activeTab] = tempEditorValue
            return newData
        })
    }
    const changeTab = (tabName) => {
        saveTab()
        const newTabData = fileData[tabName]
        tempEditorValue = newTabData
        setEditorValue(newTabData)
        setActiveTab(tabName)
    }
    const updateEditorValue = (currentValue) => tempEditorValue = currentValue 
    const createWebsite = () => {
        const cssReference = '<link href="./styles.css" rel="stylesheet">'
        const jsReference = '<script src="./script.js"></script>'
        const splashHTML = '<!-- HTML, CSS & JS files collated with Sandbox (Software Made By Akrit Ghimire) -->'
        
        let html = fileData['html'].replace(/\n/g, "")
        let css = fileData['css'].replace(/\n/g, "")
        let js = fileData['js'].replace(/\n/g, ";")

        if (html.search(cssReference > -1)) {
            html = html.replace(cssReference, `
                <!--${cssReference}-->
                <!-- For External stylesheets, uncomment the above and put the styles (from below) in a separate stylesheet named 'styles.css' in the same folder.-->
                <style>${css}</style>
            `)
        }
        if (html.search(jsReference > -1)) {
            html = html.replace(jsReference, `
                <!--${jsReference}-->
                <!-- For External javascript files, uncomment the above and put the script (from below) in a separate js script file named 'script.js' in the same folder.-->
                <script defer>${js}</script>
            `)
        }
        return html + splashHTML
    }
    const runWebsite = () => {
        changeTab(activeTab == 'html' ? 'css' : 'html') // save tab data on menu open
        
        setEditorVisibility(false)
        setEmulatorVisibility(true)
    }



    // Emulator Functions
    useEvent(() => {
        if (!emulatorVisibility) return

        const iframe = document.getElementById('iframe')
        iframe.srcdoc = createWebsite()
        console.log(iframe.srcdoc)
        return () => {}
    })
    const closeEmulator = () => {
        setEmulatorVisibility(false)
        setEditorVisibility(true)
    }
    const openMenu = () => {
        changeTab(activeTab == 'html' ? 'css' : 'html') // save tab data on menu open
        setEditorVisibility(false)
        setMenuVisibility(true)
    }



    // Menu Page Functions
    const closeMenu = () => {
        setEditorVisibility(true)
        setMenuVisibility(false)
    }
    const loadProject = (data) => {
        setFileData(data)
        setActiveTab('html')
        setEditorValue(data['html'])
        closeMenu()
    }
    const newProject = () => {
        if (window.confirm('Creating a new project will overwrite the current project. Do you wish to continue?')) loadProject(defaultFileData)
    }
    const getProjectFile = () => {
        // create input element
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = '.akrit'
        // open file explorer
        fileInput.onchange = () => {
            const validFile = [...fileInput.files].filter((file) => 'text/akrit'.includes(file.type));
            // input validation
            if (validFile.length < 1) {
                alert('This is not a valid project file.')
                return
            }
            const file = fileInput.files[0]
            // read file
            const fileReader = new FileReader()
            fileReader.readAsText(file)
            fileReader.addEventListener('load', (e) => {
                // load project
                loadProject(JSON.parse(e.target.result))
            })
        }
        fileInput.click()
    }
    const downloadProject = (data, downloadName, fileExtension, type, defaultPrefix) => {
        const downloadProjectName = downloadName.length > 1 ? downloadName.replace(/ /g, "") : defaultPrefix + new Date().toLocaleDateString()
        const aDownloadTag = document.createElement('a')
        const downloadData = new Blob([type == 'text/html' ? data : JSON.stringify(data)], { type })
        aDownloadTag.href = URL.createObjectURL(downloadData)
        aDownloadTag.download = `${downloadProjectName}${fileExtension}`
        aDownloadTag.click()
        closeMenu()
    }
    const saveProject = () => {
        const projectName = prompt('Please enter a file name for your project.')
        downloadProject(
            fileData,
            projectName,
            '.akrit',
            'text/akrit',
            'SandboxSaveFile-'
        )
        
    }
    const exportProject = () => {
        const htmlFile = createWebsite()

        const projectName = prompt('Please enter a file name for your project export.')
        downloadProject(
            htmlFile,
            projectName,
            '.html',
            'text/html',
            'SandboxExportFile-'
        )
    }




    // Keyboard Functions
    useEvent(() => {
        editor = document.getElementById('editor')
        editor.addEventListener('click', () => {
            selectionStart = editor.selectionStart
            selectionEnd = editor.selectionEnd
        })
        editor.addEventListener('keydown', (e) => {
            if (e.key == "Tab") {
                e.preventDefault()
                addCharacter('    ')
            }
            if (e.key == "Backspace" && isATabSpace()) {
                e.preventDefault()
                deleteCharacter()
            }
        })
        return () => {}
    })
    const focusEditor = () => {
        if (editor) {
            editor.selectionStart = selectionStart
            editor.selectionEnd = selectionEnd
            editor.focus()
        }
    }
    const addCharacter = (characters) => {
        const startPos = editor.selectionStart
        const endPos = editor.selectionEnd
        tempEditorValue = tempEditorValue.slice(0, startPos) + characters + tempEditorValue.slice(endPos, tempEditorValue.length)
        // update selection
        selectionStart = startPos + characters.length
        selectionEnd = endPos + characters.length
        saveTab()
        setEditorValue(tempEditorValue)
        focusEditor()
    }
    const isATabSpace = () => {
        if (tempEditorValue.slice(editor.selectionStart-4, editor.selectionEnd) == '    ') return true
        return false
    }
    const deleteCharacter = () => {
        const startPos = editor.selectionStart
        const endPos = editor.selectionEnd

        if (startPos == 0) return
        let sliceVal = isATabSpace() ? 4 : 1 // delete only one space by default but 4 if is a tab space

        tempEditorValue = tempEditorValue.slice(0, startPos-sliceVal) + tempEditorValue.slice(endPos, tempEditorValue.length)
        // update selection
        selectionStart = startPos -1
        selectionEnd = endPos -1
        saveTab()
        setEditorValue(tempEditorValue)
        focusEditor()
    }
    const moveRight = () => {
        selectionStart +=1
        selectionEnd += 1
        focusEditor()
    }
    const moveLeft = () => {
        selectionStart -= 1
        selectionEnd -= 1
        focusEditor()
    }

    return `
        <div data-app-container>
            ${renderComponent(
                Editor, 
                {
                    editorVisibility, 
                    changeTab, 
                    runWebsite, 
                    activeTab, 
                    editorValue,
                    updateEditorValue,
                    openMenu,

                    addCharacter,
                    deleteCharacter,
                    moveRight, 
                    moveLeft
                }, 
                name
            )}
            ${renderComponent(
                Menu, 
                {
                    menuVisibility,
                    newProject,
                    getProjectFile,
                    saveProject,
                    exportProject,
                    closeMenu
                }, 
                name
            )}
            ${renderComponent(
                Emulator, 
                {
                    emulatorVisibility,
                    closeEmulator
                }, 
                name
            )}
        </div>
    `
}

setTitle('Sandbox')
setStyle('./styles/app.css')
setStyle('./styles/tabs.css')
setStyle('./styles/editor.css')
setStyle('./styles/keyboard.css')
setIcon('./media/images/logo.png')
renderRoot(App)