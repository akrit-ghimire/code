const app = {
    consts: {
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        line_elem: document.querySelector('line')
    },
    containers: {
        day: document.querySelector('day-viewer'),
        schedule: document.querySelector('schedule'),
    },
    data: {
        current_day: null,
        day_content: {}
    },
    days_viewer: {
        generate_day: (day) => `<day id="${day}" onclick="app.days_viewer.switch_day('${day}')">${day[0]}</day>`,
        generate: () => {
            app.containers.day.innerHTML = ''

            for (let day of app.consts.days){
                app.containers.day.insertAdjacentHTML('beforeend', app.days_viewer.generate_day(day))
            }
        },
        switch_day: (day) => {
            days_list = Array.from(app.containers.day.children)
            
            days_list.forEach(day_elem => {
                if (day_elem.id == day) {
                    // highlight here
                    day_elem.classList.add('active')
                } else {
                    day_elem.classList.remove('active')
                }
            })

            app.data.current_day = day

            app.schedule.reset()
            app.schedule.show_content()
        }
    },
    schedule: {
        elements: {
            time_block: (time, isAm) => `<time-block id="_${time}${isAm ? 'am' : 'pm'}">${time}${isAm ? 'am' : 'pm'}</time-block>`,
            check_block: (text) => `<check-block onclick="this.classList.toggle('striked')">${text}</check-block>`,
            text_block: (text) => `<text-block>${text}</text-block>`,
        },
        add_element: (elem) => {
            app.containers.schedule.insertAdjacentHTML('beforeend', elem)
        },
        reset: () => {
            app.containers.schedule.innerHTML = ''
        },
        load_content: (tasks, callback) => {
            tasks.forEach(task => {
                task.days.forEach(day => {
                    if (!app.data.day_content[day]) app.data.day_content[day] = []

                    app.data.day_content[day].push(task)
                })
            })
        },
        show_content: () => {
            const day = app.data.current_day
            const content = app.data.day_content[day]

            if (!content) return

            const clean_up_ids = []

            for (let i = 5; i < 22; i++) {
                
                content.forEach(task => {
                    if (task.time == i) {
                        if (i < 13) {
                            app.schedule.add_element(app.schedule.elements.time_block(i, true))
                            clean_up_ids.push(`_${i}am`)
                        }
                        else {
                            app.schedule.add_element(app.schedule.elements.time_block(i -12, false))
                            clean_up_ids.push(`_${i}pm`)
                        } 
                        app.schedule.add_element(app.schedule.elements[task.type](task.content))
                    }
                })
            }

            const duplicate_free_ids = Array.from(new Set(clean_up_ids))

            duplicate_free_ids.forEach(id => {
                const elements_corresponding = Array.from(document.querySelectorAll(`#${id}`)) // get all matching time blocks
                
                if (elements_corresponding.length != 1) { // if not length one
                    elements_corresponding.shift() // then remove the first one from the list
                    elements_corresponding.forEach(element => { // and delete the rest from the page
                        element.remove()
                    })
                }   
            })
        }
    },  
    __init__: () => {
        app.days_viewer.generate()
        app.schedule.load_content(tasks)
        app.days_viewer.switch_day('monday') // todo get current day
    }
}
app.__init__()
