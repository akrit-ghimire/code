// extract data
// 
const data_directory = extract_page_data()
const create_folder = (folder, sub_contents) => {
    const folder_element = document.createElement('div')
    folder_element.role = "button"
    folder_element.classList.add('dox-override-list-group-item', 'list-group-item', 'list-group-item-action', 'px-4', 'py-2', 'me-5')
    
    const sub_list_container = document.createElement('div')
    sub_list_container.style.display = 'none'
    sub_list_container.classList.add('dox-list-content')
    
    const toggle_button = document.createElement('a')
    toggle_button.innerText = folder
    toggle_button.insertAdjacentHTML('beforeend', `<i data-accordian-icon class="fa fa-angle-left fs-4 fw-semibold text-dark float-end"></i>`)
    toggle_button.addEventListener('click', function(e) {
        const icon = toggle_button.querySelector('[data-accordian-icon]')
        if (sub_list_container.style.display == 'none') {
            sub_list_container.style.display = 'block'
            icon.classList.remove('fa-angle-left')
            icon.classList.add('fa-angle-down')
        } else {
            sub_list_container.style.display = 'none'
            icon.classList.remove('fa-angle-down')
            icon.classList.add('fa-angle-left')
        }
    })

    folder_element.append(toggle_button)
    folder_element.append(sub_list_container)

    Object.keys(sub_contents).forEach((key, index) => {
        const sub_file_name = key
        const sub_content_link = document.createElement('a')
        sub_content_link.classList.add('dox-links', 'px-2', 'py-1', 'ms-3', 'mt-1', 'fw-normal')
        sub_content_link.addEventListener('click', function(e) {
            display_data_file(folder, sub_file_name)
        })
        sub_content_link.insertAdjacentHTML('beforeend', `
            <span class="fw-bold">${index + 1}.</span> ${sub_file_name}
        `)
        sub_list_container.append(sub_content_link)
    })  

    return folder_element
}
const display_folders = () => {
    const folder_container = document.querySelector('[data-folder-container]')
    for (const [folder, sub_contents] of Object.entries(data_directory)) {
        folder_container.append(create_folder(folder, sub_contents))
    }
}
display_folders()
// Displaying Data/Page Files
const title_preset = (content) => {return `<h2 class="fw-bold horizontal-line thick my-4">${content}</h2>`}
const subheading_preset = (content) => {return `<h3 class="horizontal-line thin mt-5"><a href="#" class="no-link-decoration">${content}<span class="ms-2 fs-3">#</span></a></h3>`}
const paragraph_preset = (content) => {return `<p>${content}</p>`}
const callout_preset = (content) => {return `<div class="card callout p-3 mt-4">${content}</div>`}
const image_preset = (content) => {return `<div class="card callout-image mt-5"><img src="${content}"></div>`}
const display_data_file = (folder, file) => {
    const page = document.querySelector('[data-page]')
    page.innerHTML = ''
    data_directory[folder][file].forEach(object => {
        const block = object.element
        const content = object.content

        console.log(object.element, object.content)

        let page_element = 'INVALID BLOCK'
        if (block == 'block-title') page_element = title_preset(content)
        else if (block == 'block-heading') page_element = subheading_preset(content)
        else if (block == 'block-para') page_element = paragraph_preset(content)
        else if (block == 'block-info') page_element = callout_preset(content)
        else if (block == 'block-image') page_element = image_preset(content)

        page.insertAdjacentHTML('beforeend', page_element)
    })
}
// TOGGLE SIDE BAR
const sidebar = document.querySelector('[data-folder-container]')
const sidebar_toggle = () => {
    if (sidebar.style.display == 'none') sidebar.style.display = 'block'
    else sidebar.style.display = 'none'
}


