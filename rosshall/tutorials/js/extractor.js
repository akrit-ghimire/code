const extract_page_data = () => {
    const extracted_page_data = [];

    for (let i = 0; i < document.styleSheets.length; i++) { 
        const sheet = document.styleSheets[i];
        const folder_name = sheet_name_formatter(sheet.href) // will return false if sheet is not in /data-files/ folder
        if (folder_name) { // if true, it will return the sub-folder the file is in.
            extracted_page_data.push(page_data_formatter(sheet, folder_name))
        }
    }

    // once all data extracted, reformat to fit folder structures.

    return folder_formatter(extracted_page_data)

}