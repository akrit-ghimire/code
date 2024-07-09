const [X, O, E] = ['x', 'o', ' ']
const SIZE = 4

const favoured_positions = [ // for expected utility
    // consecutive threes
    {
        position: (p, _) => [E, p, E, p, E],
        utility: 1.5
    },
    {
        position: (p, _) => [E, p, p, p, E],
        utility: 1.5
    },
    {
        position: (p, o) => [o, p, p, p, E],
        utility: 1.5
    },
    {
        position: (p, _) => [p, p, p, E, E],
        utility: 1.5
    },
    {
        position: (p, _) => [p, p, E, p, p],
        utility: .6
    },
    {
        position: (p, _) => [p, p, p, E, p],
        utility: .6
    },
    // consecutive twos
    {
        position: (p, _) => [E, p, p, E, E],
        utility: .6
    },
    {
        position: (p, o) => [o, p, p, E, E],
        utility: .6
    },
    {
        position: (p, o) => [E, p, p, E, o],
        utility: .6
    },
    {
        position: (p, _) => [p, p, E, E, E],
        utility: .3
    },
    {
        position: (p, o) => [p, p, E, E, o],
        utility: .3
    },
    // unconsecutive threes
    {
        position: (p, _) => [E, p, p, E, p],
        utility: .9
    },
    {
        position: (p, _) => [E, p, E, p, p],
        utility: .9
    },
    {
        position: (p, o) => [o, p, p, E, p],
        utility: .9
    },
    {
        position: (p, o) => [o, p, E, p, p],
        utility: .9
    },
    // strange positions
    {
        position: (p, _) => [p, E, p, E, p],
        utility: .3
    },
    {
        position: (p, _) => [p, E, E, p, p],
        utility: .3
    },
    {
        position: (p, _) => [p, E, E, p, E],
        utility: .1
    },
    {
        position: (p, _) => [p, E, p, E, E],
        utility: .1
    },
]
const smaller_favoured_positions = [
    // best threes for four square
    {
        position: (p, _) => [E, p, p, p],
        utility: .9
    },
    {
        position: (p, _) => [p, E, p, p],
        utility: .9
    },
    // best twos for four square
    {
        position: (p, _) => [E, p, p, E],
        utility: .6
    },
    {
        position: (p, _) => [E, E, p, p],
        utility: .6
    },
    {
        position: (p, _) => [p, E, E, p],
        utility: .3
    },
]

const initial_state = () => [
    [E, E, E, E, E],
    [E, E, E, E, E],
    [E, E, E, E, E],
    [E, E, E, E, E],
    [E, E, E, E, E]
]

const empty = (state) => {
    const board = state.flat()
    for (i in board) if (board[i] !== E) return false
    return true
}

const full = (state) => {
    const board = state.flat()
    for (i in board) if (board[i] == E) return false
    return true
}

const number_empty = (state) => {
    let count = 0
    const board = state.flat()
    for (i in board) if (board[i] == E) count++
    return count
}

const player = (state) => {
    const board = state.flat()

    let x_count = 0
    let o_count = 0

    for (i in board) {
        const value = board[i]
        if (value == X) x_count++
        else if (value == O) o_count++
    }

    return x_count == o_count ? X : O
}

const actions = (state) => {
    const possibles = []

    for (let i = 0; i < state.length; i++) 
        for (let j = 0; j < state[i].length; j++) 
            if (state[i][j] == E) possibles.push([i, j])

    return possibles
}

const result = (state, action) => {
    const valid_action = actions(state).some(possible_action => possible_action[0] === action[0] && possible_action[1] === action[1])

    if (!valid_action) return state

    const board = JSON.parse(JSON.stringify(state))
    const piece = player(state)

    const [i, j] = action
    board[i][j] = piece

    return board
}

const count = (array, search) => array.reduce((acc, current) => current === search ? acc + 1 : acc, 0)
const permute = (array, length) => array.reduce((acc, _, i) => (i <= array.length - length ? acc.concat([array.slice(i, i + length)]) : acc), [])
const transpose = (array) => array[0].map((_, col) => array.map(row => row[col]))
const mirror = (array) => array.map(row => row.slice().reverse())
const diagonals = (array, query = () => true) => {
    const n = array.length;

    const get_diagonal = (row, col) => {
        const diagonal = []
        while (row < n && col < n) {
            diagonal.push(array[row][col])
            row++
            col++
        }
        return diagonal
    };

    const results = [
        ...Array(n).keys().map(col => get_diagonal(0, col)),
        ...Array(n - 1).keys().map(row => get_diagonal(row + 1, 0))
    ]

    return results.filter(query)
}

const patterns = (state, size = SIZE) => {
    const results = []

    let row, permutations;

    for (i in state) { // horisontal
        row = state[i]
        permutations = permute(row, size)

        for (j in permutations) results.push(permutations[j])
    }

    let col, diagonal;
    const state_t = transpose(state)

    for (i in state_t) { // vertical
        col = state_t[i]
        permutations = permute(col, size)

        for (j in permutations) results.push(permutations[j])
    }

    // diagonals forward
    const state_forward = diagonals(state, (array) => array.length >= size)
    for (i in state_forward) {
        diagonal = state_forward[i]
        permutations = permute(diagonal, size)

        for (j in permutations) results.push(permutations[j])
    }

    // diagonals forward
    const state_mirror = mirror(state)
    const state_backward = diagonals(state_mirror, (array) => array.length >= size)
    for (i in state_backward) {
        diagonal = state_backward[i]
        permutations = permute(diagonal, size)

        for (j in permutations) results.push(permutations[j])
    }

    return results
}

const winner = (state) => {
    const possibles = patterns(state)

    for (let i = 0; i < possibles.length; i++) {
        const pattern = possibles[i];
        if (count(pattern, X) == SIZE) return X
        if (count(pattern, O) == SIZE) return O
    }

    return null
}

const terminal = (state) => winner(state) !== null || full(state)

const utility = (state) => {
    const champion = winner(state)

    if (champion == X) return 10
    if (champion == O) return -10
    return 0
}

const expected_utility = (state) => {
    const possibles = patterns(state, 5)
    const possibles_four = [...diagonals(state, (array) => array.length == 4), ...diagonals(mirror(state), (array) => array.length == 4)]
    const pieces = [[X, 1], [O, -1]]
    
    let total_utility = 0

    for (let i = 0; i < possibles.length; i++) {
        const pattern = possibles[i]
        const reversed_pattern = [...pattern].reverse()

        pieces.forEach(piece => {
            const counter = piece[0] == X ? O : X

            favoured_positions.forEach(possible => {
                if (
                    pattern.join() == possible.position(piece[0], counter).join() ||
                    reversed_pattern.reverse().join() == possible.position(piece[0], counter).join()
                ) {
                    total_utility += possible.utility * piece[1]
                }
            })
        })
    }    
    for (let i = 0; i < possibles_four.length; i++) {
        const pattern = possibles_four[i]
        const reversed_pattern = [...pattern].reverse()

        pieces.forEach(piece => {
            const counter = piece[0] == X ? O : X 

            smaller_favoured_positions.forEach(possible => {
                if (
                    pattern.join() == possible.position(piece[0], counter).join() ||
                    reversed_pattern.join() == possible.position(piece[0], counter).join()
                ) {
                    total_utility += possible.utility * piece[1]
                }
            })
        })
    }

    return total_utility
}

const max_value = (state, depth, alpha, beta) => {
    if (terminal(state)) return utility(state)
    if (depth < 1) return expected_utility(state)

    let v = -Infinity

    const possible_actions = actions(state)

    for (i in possible_actions) {
        v = Math.max(v, min_value(result(state, possible_actions[i]), depth -1, alpha, beta))
        if (v >= beta) return v 
        alpha = Math.max(alpha, v)
    }

    return v
}

const min_value = (state, depth, alpha, beta) => {
    if (terminal(state)) return utility(state)
    if (depth < 1) return expected_utility(state)

    let v = Infinity

    const possible_actions = actions(state)

    for (i in possible_actions) {
        v = Math.min(v, max_value(result(state, possible_actions[i]), depth -1, alpha, beta))
        if (v <= alpha) return v
        beta = Math.min(beta, v)
    }

    return v
}

const minimax = (state) => new Promise((resolve, _) => {
    const current = player(state)
    const possibles = actions(state)

    if (empty(state)) resolve(possibles[Math.floor(Math.random() * possibles.length)])
    
    // intelligent depth
    const num_empty = number_empty(state)
    if (num_empty > 20) depth = 2
    else if (num_empty > 13) depth = 3
    else if (num_empty > 7) depth = 5

    let alpha = -Infinity
    let beta = Infinity


    if (current == X) { // maximise
        let best_value = -Infinity
        let best_action = possibles[0]

        for (let action of possibles) {
            let value = min_value(result(state, action), depth, alpha, beta)
            if (value > best_value) {
                best_value = value
                best_action = action
            }
            alpha = Math.max(alpha, best_value)
        }

        resolve(best_action)
    }

    // minimise
    let best_value = Infinity
    let best_action = possibles[0]

    for (let action of possibles) {
        let value = max_value(result(state, action), depth, alpha, beta)
        if (value < best_value) {
            best_value = value
            best_action = action
        }
        beta = Math.min(beta, best_value)
    }

    resolve(best_action)
})
