import {
    onclick,
} from '../libraries/MICRO-REACT-DOM.js'

const Tab = name => ({text, icon, callback, active}) => {
    const btnId = text ? text + 'ButtonID' : icon + 'ButtonID'
    return `
        <div class="tab px-2 ${active ? 'fill-a': 'fill-n'} hover" id="${btnId}" ${callback ? onclick(btnId, callback) : ''}>
            <span><p>${text ? text : ''}${icon ? '&nbsp;': ''}</p>${icon ? `<i class="material-icons">${icon}</i>` : ''}</span>
        </div>
    `
}
export default Tab