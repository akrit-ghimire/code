function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function confetti(target_element) {
    let titleWidth = target_element.offsetWidth;
    let totalConfetti = Math.floor(titleWidth / 10) * 10;
    totalConfetti = totalConfetti > 50 ? 50 : totalConfetti;

    for (var i = 0; i <= totalConfetti; i++) {
        const particle = document.createElement('i')
        particle.classList.add('confetti')
        particle.style.zIndex = 999
        particle.style.transform = `translate3d(${randomNumber(1, 500) - 250}px, ${randomNumber(1, 200) - 150}px, 0) rotate(${randomNumber(1, 360)}deg)`
        particle.style.backgroundColor = `hsla(${randomNumber(1, 360)}, 100%, 50%, 0.8)`
        target_element.append(particle);
        setTimeout(function(){particle.remove()}, 1500);
    }
}
export default confetti
// Scavanged from a codepen. I have sadly forgotten the authors name.