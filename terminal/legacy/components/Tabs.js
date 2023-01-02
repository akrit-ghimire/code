import {
    renderComponent, unpack,
} from '../libraries/MICRO-REACT-DOM.js'

import Tab from './Tab.js'


const Tabs = name => ({ buttonSection, activeTab, changeTab, runWebsite, openMenu }) => {
    const LeftTabs = [
        {text: 'html', icon: null, callback: () => changeTab('html')},
        {text: 'css', icon: null, callback: () => changeTab('css')},
        {text: 'js', icon: null, callback: () => changeTab('js')}
    ]
    const RightTabs = [
        {text: 'Run', icon: 'code', callback: () => runWebsite()},
        {text: '', icon: 'more_horiz', callback: () => openMenu()},
    ]
    const buttonData = buttonSection == 'left' ? LeftTabs : RightTabs
    const buttons = buttonData.map(button => {
        const active = button.text == activeTab
        return renderComponent(Tab, {...button, active}, name)
    })
    return `
        ${unpack(buttons)}
    `
}
export default Tabs