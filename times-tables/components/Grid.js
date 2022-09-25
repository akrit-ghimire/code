import { unpack, onclick } from "../libraries/MICRO-REACT-DOM.js"

const Grid = name => ({changeMultiplication }) => {
    const buttons = []
    for (let i = 1; i < 13; i++) buttons.push(`<button id="multiplication${i}" ${onclick(`multiplication${i}`, () => changeMultiplication(i))}>${i}</button>`)
    return `
        ${unpack(buttons)}
    `
} 
export default Grid