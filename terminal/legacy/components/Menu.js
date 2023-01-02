import {
    renderComponent,
    unpack,
} from '../libraries/MICRO-REACT-DOM.js'

import MenuButton from './MenuButton.js'

const Menu = name => ({menuVisibility, newProject, getProjectFile, saveProject, exportProject, closeMenu}) => {
    const buttonData = [
        {text: 'New Project', icon: 'code', callback: () => newProject(), active: true},
        {text: 'Load Project', icon: 'file_upload', callback: () => getProjectFile()},
        {text: 'Save Project', icon: 'file_download', callback: () => saveProject()},
        {text: 'Export Project', icon: 'terminal', callback: () => exportProject()},
        {text: 'Go Back', icon: 'undo', callback: () => closeMenu()},
    ]
    const buttons = buttonData.map(button => renderComponent(MenuButton, {...button}, name))
    return `
        <div id="menu" style="display:${menuVisibility ? 'grid' :  'none'}" class="px-1 py-1">
            <h1>Sandbox</h1>
            ${unpack(buttons)}
        </div>
    `
}
export default Menu