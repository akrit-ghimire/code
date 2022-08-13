const strip_string = (string, remove_parts) => {
    if (remove_parts.length < 1) return string

    let new_string = string
    for (i in remove_parts) {
        new_string = new_string.replace(remove_parts[i], '')
    }

    return new_string
}
const forage_folder_name = (href) => {
    let folder_name = href.split('/data-files/')[1] // 'etc/data-files/api/data-file-intro.css' to 'api/data-file-intro.css'
    folder_name = folder_name.split('/')[0] // 'api/data-file-intro.css' to 'api' only
    folder_name = folder_name.replaceAll('%20', ' ') // remove the %20 with an actual space 
    return folder_name
}
const sheet_name_formatter = (sheet_href) => {
    // desired process
    // check if in data-files folder, if so the check which folder
    if (sheet_href.includes('/data-files/')) return forage_folder_name(sheet_href)
    return false
}
const page_data_formatter = (sheet, folder) => {

    // desired data output 
    // {page: <block-title>, folder: <block-folder>, content: <all-data>}

    const rules = ('cssRules' in sheet)? sheet.cssRules : sheet.rules;
    const page_data = []            

    let title

    for (var i = 0; i < rules.length; i++) {
        const rule = rules[i];

        // format of rule to clear || content: "<data>";
        let content = strip_string(rule.style.cssText, ['content: \"', '\";'])

        const data = {
            element: rule.selectorText,
            content,
        }

        if (rule.selectorText == 'block-title') title = content

        page_data.push(data);
    }

    return {title, folder, content: page_data}
}
const folder_formatter = (extracted_page_data) => {
    const directory = {}

    // desired data output
    // directory (dict)
    //      -- folder (dict)
    //          -- title, page_data (dict)

    for (page in extracted_page_data) {
        const page_data = extracted_page_data[page]
        const folder = page_data.folder
        const title = page_data.title
        const content = page_data.content

        if (directory[folder] == undefined) directory[folder] = []
        directory[folder][title] = content
    }

    return directory
}

