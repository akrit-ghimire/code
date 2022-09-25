import { unpack, onclick } from "../libraries/MICRO-REACT-DOM.js"

const Results = name => ({questions, backToMenu}) => {

    if (questions.length == 0) return ''

    let numCorrect = 0
    const scores = questions.map(question => {
        const answerIsCorrect = question.answer == question.input
        if (answerIsCorrect) numCorrect++
        const answer = question.input ? "You put: " + question.input : "DNF"
        return `<li style="color:${answerIsCorrect ? 'var(--success-color)' : 'var(--main-color)'}"><span>${question.question.replace(' = ?', '')} = ${question.answer}</span><span>${answer}</span></li>`
    })
    const percentage = Math.round(numCorrect / questions.length * 100)
    return `
        <h2><i class="material-icons" id="backButton" ${onclick('backButton', () => backToMenu())}>arrow_back</i><span>Results</span></h2>
        <h1>${percentage}%</h1>
        <p>${percentage > 85 ? "Well done. That's AMAZING!!!" : "Try practicing more of these."}</p>
        <ul>
            ${unpack(scores)}
        </ul>
    `
} 
export default Results