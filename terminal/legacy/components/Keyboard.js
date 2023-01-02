import {
    onclick,
    renderComponent,
    unpack,
    useEvent,
    useState,
} from '../libraries/MICRO-REACT-DOM.js'


// keybaord layout data
const extraKeys = [
    {
        titleIcon: 'numbers', // numbers
        keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    },
    {
        titleIcon: 'calculate', // logic
        keys: ['+', '-', '/', '*', '^', '=', '<', '>', '|', '&']
    },
    {
        titleIcon: 'data_object', // brackets
        keys: ['(', ')', '{', '}', '[', ']', '"', "'", "`"]
    },
    {
        titleIcon: 'monetization_on', // symbols
        keys: ['!', '£', '$', '%', '#', ':', ';', '@', '-']
    }
]
const standardKeyLayout = [
    "< >","q", "w", "e", "r", "t", "y", "u", "i", "o", "p","< />",
    "tab", "a", "s", "d", "f", "g", "h", "j", "k", "l", "backspace",
    "caps", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?", "enter",
    "left", "space", "right",
]



const Icon = (icon_name) => `<i class="material-icons">${icon_name}</i>`
const Keyboard = name => ({addCharacter, deleteCharacter, moveRight, moveLeft}) => {
    const [capsLock, setCapsLock] = useState(false)
    const [extraKeyIndex, setExtraKeyIndex] = useState(0)


    // generate all the extra keys
    const extraKeyElements = []
    const length = extraKeys[extraKeyIndex]['keys'].length
    for (let i = 0; i < 11; i++) {
        if (i < length) {
            const key = extraKeys[extraKeyIndex]['keys'][i]
            extraKeyElements.push(`<div id="extraKey${i}" ${onclick(`extraKey${i}`, () => addCharacter(key))} class="keyboard_key">${key}</div>`)
        }
        else if (i == 10) {
            const icon = extraKeys[extraKeyIndex]['titleIcon']
            const onclickFunc = onclick('toggleExtraKeysButtonID', () => setExtraKeyIndex(prev => {
                let newIndex = prev + 1
                if (newIndex >= extraKeys.length) newIndex = 0
                return newIndex
            }))
            extraKeyElements.push(`<div id="toggleExtraKeysButtonID" ${onclickFunc} class="keyboard_key keyboard_key--vibrant">${Icon(icon)}</div><br>`)
        }
        else extraKeyElements.push(`<div id="extraKey${i}" style="display: none;"></div>`)
    }



    // generate all the standard keys
    const keyElements = standardKeyLayout.map(key => {
        const lineBreak = ["change", "< />", "backspace", "enter"].indexOf(key) !== -1 ? '<br>' : ''
        
        const keyID = key + 'keyboardKeyID' 
        let displayKey
        let displayKeyClasses = 'keyboard_key ' // must have space at end
        let onclickFunc

        const addCharOnClick = (addKey) => onclick(keyID, () => addCharacter(addKey))

        switch (key) {
            case "backspace":
                displayKeyClasses += 'keyboard_key--wide'
                displayKey = Icon('backspace')
                onclickFunc = onclick(keyID, deleteCharacter)
                break;
            case "caps":
                displayKeyClasses += 'keyboard_key--wide keyboard_key--activatable' + (capsLock ? ' keyboard_key--active' : '')
                displayKey = Icon('keyboard_capslock')
                onclickFunc = onclick(keyID, () => setCapsLock(prev => !prev))
                break;
            case "enter":
                displayKeyClasses += 'keyboard_key--wide keyboard_key--vibrant'
                displayKey = Icon('keyboard_return')
                onclickFunc = addCharOnClick('\n')
                break;
            case "space":
                displayKeyClasses += 'keyboard_key--extra-wide'
                displayKey = Icon('space_bar')
                onclickFunc = addCharOnClick(' ')
                break;
            case "tab":
                displayKeyClasses += 'keyboard_key--wide'
                displayKey = Icon('keyboard_tab')
                onclickFunc = addCharOnClick('    ')
                break;
            case "right":
                displayKey = Icon('keyboard_arrow_right')
                onclickFunc = onclick(keyID, () => moveRight())
                break;
            case "left":
                displayKey = Icon('keyboard_arrow_left')
                onclickFunc = onclick(keyID, () => moveLeft())
                break;
            case "< >":
                displayKey = key
                displayKeyClasses += 'keyboard_key--wide'
                onclickFunc = addCharOnClick(key)
                break;
            case "< />":
                displayKey = key
                displayKeyClasses += 'keyboard_key--wide'
                onclickFunc = addCharOnClick(key)
                break;
            default: // standard keys
                displayKey = capsLock ? key.toUpperCase() : key.toLowerCase()
                onclickFunc = addCharOnClick(key)
                break;

        }
        return `<div id="${keyID}" class="${displayKeyClasses}" ${onclickFunc}>${displayKey}</div>` + lineBreak
    })

    return `
        <div id="keyboard" class="keyboard py-1">
            <div class="keyboard_keys">
                ${unpack(extraKeyElements)}
                ${unpack(keyElements)}
            </div>
        </div>
    `
}
export default Keyboard