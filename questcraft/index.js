const quests = []
const minecraft_day = 20 * 60000

const sound = {
    elem: document.querySelector('audio'),
    play: (name, loop = false) => {
        sound.elem.src = `./sounds/${name}.mp3`
        sound.elem.loop = loop
    }
}

const page_elements = {
    home: document.querySelector('#home'),
    selecting: document.querySelector('#selecting'),
    quest: document.querySelector('#quest_view'),
    reward: document.querySelector('#rewards_view'),
    failed: document.querySelector('#failed_view')
}

const router = {
    hash_prefix: '#_/',
    get_route: () => window.location.hash.replace(router.hash_prefix, ''),
    update_route: (url) => window.location.hash = `${router.hash_prefix}${url}`,
    set_default_route: () => {
        if (window.location.hash.includes(router.hash_prefix) == false) window.location.hash = router.hash_prefix
    }
}

const buttons = {
    select_view: Array.from(document.querySelectorAll('[data-to-selecting-view]')),
    quest_view: document.querySelector('[data-to-quest-view]'),
    next_quest: document.querySelector('[data-next-quest]'),
    rewards_view: document.querySelector('[data-to-rewards]'),
    pause_play: document.querySelector('[data-pause-play]')
}

const quest_elems = {
    title: Array.from(document.querySelectorAll('[data-quest-title]')),
    desc: Array.from(document.querySelectorAll('[data-quest-desc]')),
    icon: Array.from(document.querySelectorAll('[data-quest-icon]')),
    timelimit: Array.from(document.querySelectorAll('[data-quest-time-limit]')),
    reward_text: document.querySelector('[data-quest-reward]'),
    sacrifice_text: document.querySelector('[data-quest-sacrifice]'),
    reward_group: document.querySelector('[data-rewards-group]'),
    sacrifice_group: document.querySelector('[data-sacrifice-group]'),
    progress_bar: document.querySelector('[data-progress-bar]'),
   
    group_card: (icon_path, text) => `
        <dark-card-2>
            <img src="${icon_path}">
            <dark-card-para>${text}</dark-card-para>
        </dark-card-2>
    `
}

const shuffle = (array) => {
    let shuffled_array = array
    let currentIndex = shuffled_array.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [shuffled_array[currentIndex], shuffled_array[randomIndex]] = [
        shuffled_array[randomIndex], shuffled_array[currentIndex]];
    }
  
    return shuffled_array;
  }

const app = {
    pause: false,
    debounce: false,
    progress_id: null,
    timer_val: 0,

    current_quest_index: 0,
    quests: [],

    change_page: (name) => {
        const pages = ['home', 'selecting', 'quest', 'reward', 'failed']
        pages.forEach(page => {
            page_elements[page].style.display = 'none'
        })

        page_elements[name].style.display = 'flex'
    },
    display_quest: (quest) => {
        quest_elems.title.forEach(elem => elem.innerText = quest.title)
        quest_elems.desc.forEach(elem => elem.innerText = quest.desc)
        quest_elems.icon.forEach(elem => elem.src = quest.icon)
        quest_elems.timelimit.forEach(elem => elem.innerText = quest.timelimit + ' minecraft days')

        quest_elems.reward_group.innerHTML = ''
        formatted_reward_text = ''
        quest.rewards.forEach(reward => {
            formatted_reward_text += `${reward.quantity} ${reward.name}, `
            quest_elems.reward_group.insertAdjacentHTML('beforeend', quest_elems.group_card(reward.icon, reward.quantity))
        })
        quest_elems.reward_text.innerText = formatted_reward_text

        quest_elems.sacrifice_group.innerHTML = ''
        formatted_sacrifice_text = ''
        quest.sacrifice.forEach(sacrifice => {
            formatted_sacrifice_text += `${sacrifice.quantity} ${sacrifice.name}, `
            quest_elems.sacrifice_group.insertAdjacentHTML('beforeend', quest_elems.group_card(sacrifice.icon, sacrifice.quantity))
        })
        quest_elems.sacrifice_text.innerText = formatted_sacrifice_text
    },
    next_quest: () => {
        if (app.current_quest_index + 1 > app.quests.length -1) app.current_quest_index = 0
        else app.current_quest_index += 1

        app.display_quest(app.quests[app.current_quest_index])
    },

    end_timer: () => {
        if (app.progress_id) {
            clearInterval(app.progress_id)
            app.debounce = false
        }
    },

    start_timer: () => {
        if (app.debounce) return

        app.pause = false
        app.debounce = true
        let width = 100

        let timeleft = app.quests[app.current_quest_index].timelimit * minecraft_day
        let decrement = timeleft / 100

        quest_elems.progress_bar.style.width = '100%'
        app.timer_val = Math.round(timeleft / minecraft_day)
        quest_elems.timelimit.forEach(elem => {
            elem.innerText = `${app.timer_val} minecraft days left`
        })

        const frame = () => {
            if (width <= 0) {
                app.debounce = false;
                app.end_timer()
                app.change_page('failed')
                sound.play('failed')
            } else if (app.pause == false) {
                width--;
                timeleft -= decrement
                app.timer_val = Math.round(timeleft / minecraft_day)

                quest_elems.timelimit.forEach(elem => {
                    elem.innerText = `${app.timer_val} minecraft days left`
                })
                quest_elems.progress_bar.style.width = width + "%";
            }
        }

        app.progress_id = setInterval(frame, decrement)

    },

    pause_play_timer: () => {
        app.pause = !app.pause
        
        sound.play('click')
        if (app.pause) {
            quest_elems.timelimit.forEach(elem => {
                elem.innerText = 'Timer Paused'
            })
            buttons.pause_play.innerText = 'Continue Timer'
        } else {
            quest_elems.timelimit.forEach(elem => {
                elem.innerText = `${app.timer_val} minecraft days left`
            })
            setTimeout(() => {
                sound.play('quest', true)
            }, 1000)
            buttons.pause_play.innerText = 'Pause Timer'
        }
    },
    
    init: () => {
        router.set_default_route()
        app.change_page('home')

        app.quests = shuffle(quests)

        buttons.select_view.forEach(button => {
            button.addEventListener('click', () => {
                app.change_page('selecting')
                app.next_quest()
                sound.play('click')
            })
        })
        buttons.quest_view.addEventListener('click', () => {
            app.change_page('quest')
            sound.play('click')
            setTimeout(() => {
                sound.play('quest', true)
            }, 1000)
            app.start_timer()
            
        })
        buttons.next_quest.addEventListener('click', () => {
            app.next_quest()
            sound.play('click')
        })
        buttons.rewards_view.addEventListener('click', () => {
            app.change_page('reward')
            app.end_timer()
            sound.play('click')
            setTimeout(() => {
                sound.play('reward')
            }, 1000)
        })
        buttons.pause_play.addEventListener('click', () => {
            app.pause_play_timer()
        })
    }
}

