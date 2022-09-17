import {
    onclick
} from '../libraries/MICRO-REACT-DOM.js'

const Emulator = name => ({emulatorVisibility, closeEmulator}) => {
    return `
        <div id="emulator" style="display:${emulatorVisibility ? 'block' :  'none'}">
            <iframe id="iframe"></iframe>
            <div id="emulatorCloseButton" ${onclick('emulatorCloseButton', closeEmulator)} class="tab hover fill-a">
                <span><i class="material-icons">close</i><span>
            </div>
        </div>
    `
}
export default Emulator