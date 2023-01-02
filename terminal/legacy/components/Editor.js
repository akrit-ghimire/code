import {
    onchange,
    renderComponent,
} from '../libraries/MICRO-REACT-DOM.js'
import Keyboard from './Keyboard.js'

import Tabs from './Tabs.js'

const Editor = name => ({editorVisibility, changeTab, runWebsite, activeTab, editorValue, updateEditorValue, openMenu, deleteCharacter, addCharacter, moveRight, moveLeft}) => {
    return `
        <div id="editor_window" style="display:${editorVisibility ? 'grid' :  'none'}" class="px-1 py-1">
            <div id="tabs">
                <div id="left-tabs">
                    ${renderComponent(Tabs, {buttonSection: 'left', activeTab, changeTab}, name)}
                </div>
                <div id="right-tabs">
                    ${renderComponent(Tabs, {buttonSection: 'right', runWebsite, openMenu}, name)}
                </div>
            </div>
            <div id="body-area">
                <textarea id="editor" ${onchange('editor', () => {updateEditorValue(document.getElementById('editor').value)})} inputmode="none" spellcheck="false" class="outline px-1 py-1">${editorValue}</textarea>
            </div>
            <div id="keyboard">
                ${renderComponent(
                    Keyboard,
                    {
                        addCharacter,
                        deleteCharacter,
                        moveRight, 
                        moveLeft
                    },
                    name
                )}
            </div>
        </div>
    `
}
export default Editor