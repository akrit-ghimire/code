import {
    renderRoot,
    setTitle,
    setStyle,
    useState,
    renderComponent,
} from './libraries/MICRO-REACT-DOM.js'
import Grid from './components/Grid.js'
import Quiz from './components/Quiz.js'
import Results from './components/Results.js'

const App = name => () => {
    // handle screens
    const [showGrid, setShowGrid] = useState(true)
    const [showQuiz, setShowQuiz] = useState(false)
    const [showResults, setShowResults] = useState(false)

    const [multiplication, setMultiplication] = useState(1)
    const [questions, setQuestions] = useState([])

    const createQuestions = (number) => {
        const numberOfQuestions = 24
        const generatedQuestions = []
        let currentNumber = 1
        for (let i = 1; i < numberOfQuestions + 1; i++) {
            generatedQuestions.push({question: `${number} X ${currentNumber} = ?`, answer: `${number * currentNumber}`})
            currentNumber++
            if (currentNumber > 12) currentNumber = 1
        }
        return generatedQuestions.sort(() => Math.random() - 0.5) // randomizes order
    }
    const changeMultiplication = (number) => {
        setMultiplication(number) // set multiplication to the number used
        setQuestions(createQuestions(number)) // create the questions
        setShowGrid(false) // then change screen
        setShowQuiz(true)
    }

    const quizResults = () => {
        setShowQuiz(false)
        setShowResults(true)
    }

    const backToMenu = () => {
        setShowResults(false)
        setShowGrid(true)
    }


    return `
        <div id="appContainer">
            <div id="grid" style="display: ${showGrid ? 'grid' : 'none'}">
                ${renderComponent(Grid, {changeMultiplication}, name)}
            </div>
            <div id="quiz" style="display: ${showQuiz ? 'flex' : 'none'}">
                ${renderComponent(Quiz, {questions, setQuestions, multiplication, quizResults}, name)}
            </div>
            <div id="results" style="display: ${showResults ? 'block' : 'none'}">
                ${renderComponent(Results, {questions, backToMenu}, name)}
            </div>
            render multiplication grid//
            render quiz//
            render correct, incorrect//
            render percentage correct
            render detailed scores
        </div>
    `
}

setTitle('Maths')
setStyle('./styles/app.css')
setStyle('./styles/grid.css')
setStyle('./styles/quiz.css')
setStyle('./styles/CONFETTI.css')
setStyle('./styles/results.css')
renderRoot(App)