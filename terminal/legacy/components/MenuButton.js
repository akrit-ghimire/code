import {
    onclick,
} from '../libraries/MICRO-REACT-DOM.js'

const MenuButton = name => ({text, icon, callback, active}) => {
    const btnId = text + 'MenuButtonID'
    return `
        <div class="tab px-4 ${active ? 'fill-a' : 'fill-n'} hover" id="${btnId}" ${callback ? onclick(btnId, callback) : ''}>
            <span><p>${text}${icon ? '&nbsp;': ''}</p>${icon ? `<i class="material-icons">${icon}</i>` : ''}</span>
        </div>
    `
}
export default MenuButton