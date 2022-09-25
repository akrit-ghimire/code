import confetti from "../libraries/CONFETTI.js"
import { onclick, unpack, useState } from "../libraries/MICRO-REACT-DOM.js"

const Quiz = name => ({questions, setQuestions, multiplication, quizResults}) => {
    const [input, setInput] = useState('')
    const [questionIndex, setQuestionIndex] = useState(0)
    
    if (questions.length == 0) return ''

    const addCharacter = (char) => {
        setInput(prev => {
            const newInput = prev + char

            setQuestions(currQuestionsData => {
                const newQuestions = [...currQuestionsData]
                newQuestions[questionIndex]['input'] = newInput
                // console.log(newQuestionsData[questionIndex])
                return newQuestions
            })

            return newInput
        })
    }
    const backspace = () => {
        setInput(prev => {
            const newInput = prev.length == 1 ? '' : prev.slice(0, -1)

            setQuestions(currQuestionsData => {
                const newQuestions = [...currQuestionsData]
                newQuestions[questionIndex]['input'] = newInput
                // console.log(newQuestionsData[questionIndex])
                return newQuestions
            })

            return newInput
        })
    }
    const changeQuestion = () => {
        setQuestionIndex(index => {
            const newIndex = index + 1
            if (newIndex >= questions.length) return index
            return newIndex
        })
        setInput('')
    }
    
    const questionText = questions[questionIndex].question
    const isQuizComplete = questionIndex >= questions.length - 1
    const buttons = []
    for (let i = 0; i < 10; i++) buttons.push(`<button id="quizButton${i}" ${onclick(`quizButton${i}`, () => addCharacter(i))}>${i}</button>`)
    
    const nextFunction = onclick('nextButton', () => {
        if (input == questions[questionIndex].answer) confetti(document.getElementById('quizTitle'))
        if (isQuizComplete) {
            // reset the quiz
            setQuestionIndex(0)
            setInput('')
            // transport to results page
            return quizResults()
        }
        return changeQuestion()
    })
    return `
        <div data-group>
            <h2 id="quizTitle">The ${multiplication} Times Tables Quiz</h2>
            <p>Question ${questionIndex + 1} of ${questions.length}</p>
        </div>
        <button 
            style="visibility: hidden" 
            id="nextButton" 
            class="showOnTimer" 
            ${onclick('nextButton', () => nextFunction())}  
            data-refresh="${questionIndex}changed"
        >
            ${isQuizComplete ? 'Finish' : 'Next'}
        </button>

        <div class="hideOnTimer" data-refresh="${questionIndex}changed">
            <h1>${questionText}</h1>
            <h1 id="answerField">${input}</h1>
        </div>

        <div class="hideOnTimer" data-refresh="${questionIndex}changed">
            ${unpack(buttons)}
            <button id="backspace" ${onclick('backspace', () => { backspace() })}><i class="material-icons">backspace</i></button>
            <div class="bar"><div class="progress"></div></div>
        </div>
    `
}
export default Quiz