const get = (query, parent = document) => parent.querySelector(query)
const wait = (seconds) => new Promise((resolve, _) => setTimeout(resolve, seconds * 1000))

const app = {
    size: 5,
    board_elems: [],
    board: get('.grid'),
    info_text: get('.info-text'),
    receive_input: false,
    delay: .1,

    state: null,

    add_to_board: (elem) => {
        app.board_elems.push(elem)
        app.board.appendChild(elem)
    },

    get_board_elem: (i, j) => app.board_elems[(i * app.size) + j],

    click: async (i, j) => {
        if (terminal(app.state)) return

        const action = [i, j]
        const valid_action = actions(app.state).some(possible_action => possible_action[0] === action[0] && possible_action[1] === action[1])
        if (!valid_action) return

        app.state = result(app.state, action)
        app.set_board(app.state)

        app.board_active()

        const tile = app.get_board_elem(i, j)
        tile.classList.add('flash-regular')
        await wait(.75)
        tile.classList.remove('flash-regular')

        app.computer_move()
    },

    check_state: async () => {
        if (!terminal(app.state)) return false

        const champion = winner(app.state)

        if (champion == null) app.notify('Game is a Tie.')
        else {
            if (champion == X) app.notify('Computer Wins')
            else if (champion == O) app.notify('Player wins!')

            const winning_moves = app.winning_move(app.state)

            for (move of winning_moves) app.get_board_elem(move.i, move.j).classList.add('flash-winning')
        
            await wait (2)
        }

        return true
    },

    reset: async () => {
        app.receive_input = false
        app.notify('Resetting Board...')
        await wait(3)
        app.__init__()
    },

    winning_move: (state) => {
        const meta_state = state.map((row, i) => row.map((col, j) => ({ piece: col, i: i, j: j })))
        const possibles = patterns(meta_state)

        for (let i = 0; i < possibles.length; i++) {
            const pattern = possibles[i]
            const pieces = pattern.map((value) => value.piece)

            if (count(pieces, X) !== SIZE && count(pieces, O) !== SIZE) continue

            const moves = pattern.map((value) => ({i: value.i, j: value.j}))
            return moves
        }

        return null
    },

    computer_move: async () => {
        if (await app.check_state()) return app.reset() // check if player managed to win
        
        app.board_active()
        app.notify('Computer Thinking...')

        await wait(.5)
        
        const optimal_move = await minimax(app.state)

        const [i, j] = optimal_move
        const tile = app.get_board_elem(i, j)
        tile.classList.add('flash-regular')
        await wait(.75)
        tile.classList.remove('flash-regular')

        app.state = result(app.state, optimal_move)
        app.set_board(app.state)
        
        app.board_inactive()
        
        if (await app.check_state()) return app.reset() // check if computer managed to win
        app.notify("Player's Turn")
    },

    create_square: (i, j) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.onclick = () => {
            if (app.receive_input) app.click(i, j)
        }
        return square
    },

    notify: (text) => app.info_text.innerText = text,
    board_active: () => {
        app.board.classList.add('animated-board')
        app.receive_input = false
    },
    board_inactive: () => {
        app.board.classList.remove('animated-board')
        app.receive_input = true
    },

    make: (elem, type) => {
        if (type == X) {
            elem.classList.add('x')
            elem.innerHTML = `
                <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <svg width="18.623589mm" height="18.623589mm" viewBox="0 0 18.623589 18.623589" version="1.1"
                    id="svg1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                    xmlns:svg="http://www.w3.org/2000/svg">
                    <defs id="defs1" />
                    <g id="layer1" transform="translate(-113.17643,-84.268453)">
                        <rect style="opacity:1;fill:none;fill-opacity:1;stroke:none;stroke-width:0.529167"
                            id="rect3" width="18.62359" height="18.62359" x="113.17643" y="84.268448" />
                        <path style="fill:#ffffff;stroke:none;stroke-width:0.529167"
                            d="m 126.01393,86.73897 3.45566,3.175471 -3.78254,3.735847 3.73585,3.455662 -3.26887,3.36227 -3.73585,-3.782552 -3.54906,3.642452 -3.36226,-3.268868 3.64245,-3.642453 -3.54905,-3.549057 3.17547,-3.175471 3.73585,3.642452 z"
                            id="path1" />
                    </g>
                </svg>
            `
            return
        }
        
        if (type == O) {
            elem.classList.add('o')
            elem.innerHTML = `
                <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <svg width="18.623589mm" height="18.623589mm" viewBox="0 0 18.623589 18.623589" version="1.1"
                    id="svg1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                    xmlns:svg="http://www.w3.org/2000/svg">
                    <defs id="defs1" />
                    <g id="layer1" transform="translate(-92.98588,-84.268453)">
                        <rect style="opacity:1;fill:none;fill-opacity:1;stroke:none;stroke-width:0.529167"
                            id="rect2" width="18.62359" height="18.62359" x="92.985878" y="84.268448" />
                        <path id="path2"
                            style="opacity:1;fill:#1777fe;fill-opacity:1;stroke:none;stroke-width:0.529167"
                            d="m 102.29742,85.73499 a 7.8452826,7.8452826 0 0 0 -7.845003,7.845 7.8452826,7.8452826 0 0 0 7.845003,7.84551 7.8452826,7.8452826 0 0 0 7.84551,-7.84551 7.8452826,7.8452826 0 0 0 -7.84551,-7.845 z m 0,5.18315 a 2.661792,2.661792 0 0 1 2.66185,2.66185 2.661792,2.661792 0 0 1 -2.66185,2.66185 2.661792,2.661792 0 0 1 -2.661857,-2.66185 2.661792,2.661792 0 0 1 2.661857,-2.66185 z" />
                    </g>
                </svg>
            
            `
            return
        }
        
        elem.classList.remove('x', 'o')
        elem.innerHTML = ''
    },

    set_board: (state) => {
        const values = state.flat()
        for (let i = 0; i < values.length; i++) app.make(app.board_elems[i], values[i])
    },

    __destroy__: async () => {
        app.board_elems = []
        for (const child of Array.from(app.board.children).reverse()) {
            await wait(app.delay);
            child.remove();
        }
    },
    __init__: async () => {
        await app.__destroy__()
        // Generate Board w/ Animation
        app.notify('Computer Generating Board...')
        app.board_active()
        for (let i = 0; i < app.size; i++) {
            for (let j = 0; j < app.size; j++) {
                app.add_to_board(app.create_square(i, j))
                await wait(app.delay)
            }     
        }
        app.board_inactive()

        app.state = initial_state()
        app.set_board(app.state)

        app.computer_move()
    },
}
app.__init__()