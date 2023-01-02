const pickerOptions = {
    types: [
      {
        description: 'Website Club Files',
        accept: {
          'text/akrit': '.akrit'
        }
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false
  };

const file_manager = {
    file: null,
    load: async () => {
        try {
            [file_manager.file] = await window.showOpenFilePicker(pickerOptions)
            let data = await file_manager.file.getFile()
            let text = await data.text()
            textarea.value = JSON.parse(text).data.html
            app.notify('Successfully opened ' + file_manager.file.name)
        } catch (error) {
            // user closed file picker window
        }
    },
    save: async () => {
        try {
            let stream = await file_manager.file.createWritable(pickerOptions)
            await stream.write(JSON.stringify({data: {html: app.data.code}}))
            await stream.close()
            app.notify('Successfully saved ' + file_manager.file.name)
        } catch (error) {
            // user closed file picker window
        }
    },
    save_as: async () => {
        try {
            file_manager.file = await window.showSaveFilePicker(pickerOptions)
            file_manager.save()
        } catch (error) {
            // user closed file picker window
        }
    },
    clear_file: () => {
        file_manager.file = null
    }
}