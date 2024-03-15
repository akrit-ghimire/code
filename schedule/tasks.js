const [info, task] = ['text_block', 'check_block']
const [monday, tuesday, wednesday, thrusday, friday, saturday, sunday] = ['monday', 'tuesday', 'wednesday', 'thrusday', 'friday', 'saturday', 'sunday']


const tasks = [
    {
        type: task,
        content: "Shave",
        days: [monday, tuesday, wednesday, friday],
        time: 6
    },
    {
        type: task,
        content: "Shower or Hairwash",
        days: [monday, tuesday, wednesday, friday],
        time: 6
    },
    {
        type: task,
        content: "Stretch",
        days: [monday, tuesday, wednesday, friday],
        time: 7
    },
    {
        type: task,
        content: "Exercise of the day + Cooldown stretch",
        days: [monday, tuesday, wednesday, friday],
        time: 7
    },
    {
        type: task,
        content: "Make & eat breakfast",
        days: [monday, tuesday, wednesday, friday],
        time: 8
    },
    {
        type: task,
        content: "Skincare",
        days: [monday, tuesday, wednesday, friday],
        time: 8
    },
    {
        type: task,
        content: "Pack lunch and head out",
        days: [monday, tuesday, wednesday, friday],
        time: 9
    },
    {
        type: info,
        content: "Study period starts. Keep focused until 4",
        days: [monday, tuesday, wednesday, friday],
        time: 10
    },
    ,
    {
        type: info,
        content: "Study period ended. Do not do any more work",
        days: [monday, tuesday, wednesday, friday],
        time: 16
    },
    ,
    {
        type: task,
        content: "Start your daily Spanish self-learning",
        days: [monday, tuesday, wednesday, friday],
        time: 17
    },
    {
        type: task,
        content: "Meal prep and Eat dinner",
        days: [monday,wednesday],
        time: 18
    },
    {
        type: task,
        content: "Taekwondo 7pm - 8pm",
        days: [tuesday],
        time: 19
    },
    {
        type: task,
        content: "Taekwondo 8.30pm - 10pm",
        days: [wednesday],
        time: 20
    },
    {
        type: info,
        content: "Now reward yourself with free-time",
        days: [monday],
        time: 19
    },
    ,
    {
        type: task,
        content: "Don't forget skincare before bed",
        days: [monday, tuesday, thrusday],
        time: 21
    },
]