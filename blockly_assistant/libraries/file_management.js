const file_management = {
    dump_body: document.querySelector('body'),
    // is ios platform?
    // is_ios: () => {
    //     return [
    //         'iPad Simulator',
    //         'iPhone Simulator',
    //         'iPod Simulator',
    //         'iPad',
    //         'iPhone',
    //         'iPod'
    //     ].includes(navigator.platform)
    //         // iPad on iOS 13 detection
    //         || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    // },
    // get file
    get_file: async (file_type) => {
        return await new Promise((resolve, reject) => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = `.${file_type}`

            input.addEventListener('change', async () => {
                const type = input.files[0].name.split('.').at(-1)
                if (type !== file_type && type !== 'data') {
                    // reject
                    reject(`Invalid file type. Must be a .${file_type}`)
                }
                else {
                    resolve(JSON.parse(await input.files[0].text())) // output of file
                }
            })
            file_management.dump_body.append(input)

            window.requestAnimationFrame(async () => {
                const event = new MouseEvent('click')
                input.dispatchEvent(event)
                file_management.dump_body.removeChild(input)
            })
        })
    },

    // create file
    create_file: (file_content, file_type) => {
        const file = new Blob([JSON.stringify(file_content)], { type: `.${file_type}` })
        return URL.createObjectURL(file)
    },

    // save file
    save_file: (file_name, file_type, file_content) => {
        const download_a = document.createElement('a')
        download_a.href = file_management.create_file(file_content, file_type)
        download_a.download = `${file_name}.data.${file_type}` // .data is a secondary check as ios is tricky
        file_management.dump_body.append(download_a)

        window.requestAnimationFrame(() => {
            const event = new MouseEvent('click')
            download_a.dispatchEvent(event)
            file_management.dump_body.removeChild(download_a)
        })

    }
}
