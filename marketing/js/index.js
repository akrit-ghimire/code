const manifesto = [
    "In the vibrant realm of marketing, I, Akrit Ghimire, embrace the opportunity to lead with passion, innovation, and an unwavering commitment to your cause.",
    "You may not know this, but as a fervent advocate for the power of compelling narratives, I aim to ignite brand stories that resonate with hearts and minds. If you ever find yourself in need of a dynamic marketing representative for your team, consider me not just a candidate but a willing servant to your cause.",
    "I pledge to infuse your campaigns with creativity, utilizing a multifaceted approach that spans posters, captivating freebies, engaging social media strategies, and perhaps even dynamic videos. My commitment extends to meticulous event coordination, ensuring seamless experiences that leave a lasting impact.",
    "My approach is not just about marketing; it's about creating a movement.",
    "I am ready to roll up my sleeves, dive into the trenches, and bring your brand to the forefront. So, if you're seeking a partner who is not afraid to go the extra mile, hit the stands (not me), and vote for (yes) me!",
    "Together, let's craft narratives that resonate, spark conversations, and elevate Project Share to unprecedented heights.",
    "Because <strong>Dreamwork</strong> takes <strong>Teamwork</strong>."
]

const app = {
    scrolling_content_container: document.querySelector("#scrolling_content"),
    create_scrolling_element: (text) => `<section><p class="reveal-type">${text}</p></section>`,
    load_scrolling_manifesto: () => {
        manifesto.forEach(paragraph => {
            app.scrolling_content_container.insertAdjacentHTML('beforeend', app.create_scrolling_element(paragraph))
        })
    },
    __init__: () => {
        app.load_scrolling_manifesto()
    }
}
app.__init__()