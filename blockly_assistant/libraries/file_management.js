const file_management = {
    dump_body: document.querySelector('body'),
    // get file
    get_file: async (file_type) => {
        return await new Promise((resolve, reject) => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = `application/${file_type},.${file_type}`

            input.addEventListener('change', async () => {
                if (input.files.length > 0) {
                    console.log(input.files[0].text())
                    resolve(JSON.parse(await input.files[0].text())) // output of file
                } else {
                    console.log('who')
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
        const file = new Blob([JSON.stringify(file_content)], {type: `application/${file_type}`})
        return URL.createObjectURL(file)
    },
    
    // save file
    save_file: (file_name, file_type, file_content) => {
        const download_a = document.createElement('a')
        download_a.href = file_management.create_file(file_content, file_type)
        download_a.download = `${file_name}.${file_type}`
        file_management.dump_body.append(download_a)

        window.requestAnimationFrame(() => {
            const event = new MouseEvent('click')
            download_a.dispatchEvent(event)
            file_management.dump_body.removeChild(download_a)
        })
        
    }
}
