const user_notification = {
    toast: (message) => {
        const existingToasts = Array.from(document.querySelectorAll('toast'))
        let shouldCreate = true
        existingToasts.forEach(toast => {
            if (toast.innerText == message) shouldCreate = false
        })
        if (shouldCreate) {
            const toast = document.createElement('toast')
            toast.innerText = message
            document.body.append(toast)
            setTimeout(() => {document.body.removeChild(toast)}, 5000)
        }
    },
    init: (background_color='rgb(234, 31, 99)', text_color='white', border_radius='4px') => {
        const style = document.createElement('style')
        style.innerText = `
            toast {
                display: block;
                position: fixed;
                left: 50%;
                bottom: 2rem;
                padding: 0.5rem 1.5rem;
                background-color: ${background_color};
                border-radius: ${border_radius};
                color: ${text_color};
                transform: translateX(-50%);
                opacity: 0;
                text-align: center;
                animation: toast 4s;
                z-index: 99;
            }
            
            @keyframes toast {
                0% {
                    opacity: 0;
                    bottom: 0.2rem;
                }
                10%, 40% {
                    opacity: 1;
                    bottom: 2rem;
                }
                80% {
                    opacity: 0.7;
                }
                100% {
                    opacity: 0;
                }
            }
        `
        document.head.append(style)
    }
}
user_notification.init()