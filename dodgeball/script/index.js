const theme_buttons = [
    {title: 'Fall Guys', src: './sounds/themes/fallguys1.mp3'},
    {title: 'Fall Guys 2', src: './sounds/themes/fallguys2.mp3'},
    {title: 'Raining Tacos', src: './sounds/themes/tacos.mp3'},
    {title: 'Minecraft', src: './sounds/themes/minecraft.mp3'},
    {title: 'Wednesday', src: './sounds/themes/wednesday.mp3'},
    {title: 'Kahoot', src: './sounds/themes/kahoot.mp3'},
]
const soundboard_buttons = [
    {title: 'Air Horn', src: './sounds/sfx/airHorn.mp3'},
    {title: 'Start', src: './sounds/sfx/gameStart.mp3'},
    {title: 'Claps', src: './sounds/sfx/Clapping.mp3'}
]
const timer_buttons = [
    {title: '5 min', length: 300},
    {title: '4 min', length: 240},
    {title: '3 min', length: 180},
    {title: '2 min', length: 120},
    {title: '1 min', length: 60},
    {title: '30 sec', length: 30},
]
const game_modes = [
    {title: 'Hot Potato', src: './sounds/gamemode/hotPotato.mp3'},
    {title: 'Classic', src: './sounds/gamemode/classic.mp3'},
    {title: 'Stuck in the Mud', src: './sounds/gamemode/stuckInTheMud.mp3'},
]

const app = {
    theme: {
        group: document.querySelector('theme-tune-group'),
        current_theme: null,
        create_buttons: () => {
            theme_buttons.forEach(button => {
                const button_elem = document.createElement('button')
                button_elem.innerText = button.title

                button_elem.addEventListener('click', () => {
                    app.theme.current_theme = button.title
                    app.theme.change_theme()
                    app.playtheme(button.src)
                })

                app.theme.group.append(button_elem)
            })
        },
        change_theme: () => {
            Array.from(app.theme.group.children).forEach(button => {
                button.classList.remove('active')
                if (button.innerText == app.theme.current_theme) {
                    button.classList.add('active')
                }
            })
        }
    },
    soundboard: {
        group: document.querySelector('soundboard-group'),
        create_buttons: () => {
            soundboard_buttons.forEach(button => {
                const button_elem = document.createElement('button')
                button_elem.innerText = button.title

                button_elem.addEventListener('click', () => {
                    app.playsound(button.src)
                })

                app.soundboard.group.append(button_elem)
            })
        }
    },
    timer: {
        group: document.querySelector('timer-group'),

        countdown_ref: null,
        time: 0,
        time_elem: document.getElementById('time'),

        create_buttons: () => {
            timer_buttons.forEach(button => {
                const button_elem = document.createElement('button')
                button_elem.innerText = button.title

                button_elem.addEventListener('click', () => {
                    app.timer.setTime(button.length)
                })

                app.timer.group.append(button_elem)
            })
        },
        countdown: () => {
            app.timer.countdown_ref = setInterval(() => {
                app.timer.time -= 1
                if (app.timer.time < 0) {
                    app.timer.time = 0
                }
                app.timer.update()
                console.log('running')
            }, 1000)
        },
        update: () => {
            if (app.timer.time == 0) {
                clearTimeout(app.timer.countdown_ref)
            }
            app.timer.time_elem.innerText = app.timer.time

            time = app.timer.time

            if (time == 300) app.playsound('./sounds/time/5min.mp3')
            else if (time == 240) app.playsound('./sounds/time/4min.mp3')
            else if (time == 180) app.playsound('./sounds/time/3min.mp3')
            else if (time == 120) app.playsound('./sounds/time/2min.mp3')
            else if (time == 60) app.playsound('./sounds/time/1min.mp3')
            else if (time == 30) {
                app.playsound(`./sounds/time/30sec.mp3`)
            }
        },
        setTime: (time) => {
            if (app.timer.countdown_ref) {
                clearTimeout(app.timer.countdown_ref)
            }

            app.timer.time = time + 1
            app.timer.countdown()
        },
        pause: () => {
            if (app.timer.countdown_ref) {
                clearTimeout(app.timer.countdown_ref)
            }
        }
    },
    gamemode: {
        index: 0,
        element: document.getElementById('game-mode'),
        next: () => {
            app.gamemode.index += 1
            if (app.gamemode.index > game_modes.length - 1) {
                app.gamemode.index = game_modes.length -1
            }
            app.gamemode.update()
        },
        back: () => {
            app.gamemode.index -= 1
            if (app.gamemode.index < 0) {
                app.gamemode.index = 0
            }
            app.gamemode.update()
        },
        update: () => {
            app.gamemode.element.innerText = game_modes[app.gamemode.index].title
        },
        select: () => {
            const gamemode = game_modes[app.gamemode.index]
            app.playsound(gamemode.src)
        },
    },
    theme_audio_elem: document.getElementById('theme'),
    sfx_audio_elem: document.getElementById('sfx'),
    playsound: (sound_link) => {
        app.sfx_audio_elem.src = sound_link
        app.theme_audio_elem.pause()
        app.sfx_audio_elem.play()
    },
    playtheme: (sound_link) => {
        app.theme_audio_elem.src = sound_link
        app.theme_audio_elem.play()
    },
    init: () => {
        app.theme.create_buttons()
        app.soundboard.create_buttons()
        app.timer.create_buttons()
        app.gamemode.update()
        app.timer.countdown()

        document.getElementById('play').addEventListener('click', app.timer.countdown)
        document.getElementById('pause').addEventListener('click', app.timer.pause)
        app.sfx_audio_elem.addEventListener('ended', () => {
            app.theme_audio_elem.play()
        })
    }
}
app.init()
