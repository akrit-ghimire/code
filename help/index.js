const menu_element = document.getElementById('menu')
const page_element = document.getElementById('page')
const forward_btn = document.getElementById('forward')
const back_btn = document.getElementById('back')
const page_info = document.getElementById('page_info')

const page_viewer = {
    markdown_parser: (text) => {
        const toHTML = text
        
        .replace(/>/gim, '&gt;')
        .replace(/</gim, '&lt;')
        .replace(/^@@page-final/gim, '</div>') // final so no next button shows
        .replace(/^@@page-end/gim, '<button class="next" onclick="page_changer.move_slide(1)">next page <i class="material-icons">arrow_forward</i></button></div>') // end page
        .replace(/^@@page-start/gim, '<div data-page>') // start page

        .replace(/^#code-end#/gim, '</pre></code>') // end code
        .replace(/^#code-start#/gim, '<code><pre>') // start code

        .replace(/^#a#(.*$)/gim, '<a href="$1" target="_blank">$1</a>') // link
        .replace(/^- (.*$)/gim, '<li>$1</li>') // list
        .replace(/^#newline/gim, '<br>') // new line
        
        .replace(/^!(.*$)/gim, '<img src="$1">') // h3 tag
        .replace(/^### (.*$)/gim, '<h3>$1</h3>') // h3 tag
        .replace(/^## (.*$)/gim, '<h2>$1</h2>') // h2 tag
        .replace(/^# (.*$)/gim, '<h1>$1</h1>') // h1 tag
        .replace(/\*\*\*(.*)\*\*\*/gim, '<i>$1</i>') // italic text
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>') // bold text
        .replace(/\*(.*)\*/gim, '<span class="highlight">$1</span>') // highlight text

        return toHTML.trim(); // using trim method to remove whitespace
        // code originally by Randolph Perkins - Medium Article
    },
    display_markdown: (markdown_data) => {
        const markdown = document.querySelector('md')
        markdown.innerHTML = page_viewer.markdown_parser(markdown_data)
    },
    read_file: (file) => {
        const f = new XMLHttpRequest()
        f.open("GET", file, false)
        f.onreadystatechange = () => {
            if (f.readyState === 4 && (f.status === 200 || f.status == 0)) page_viewer.display_markdown(f.responseText) 
        }
        f.send(null)
    }
}
const page_changer = {
    pages_length: null,
    current_page: null,
    move_slide: (offset) => {
        if (offset < 0 && page_changer.current_page <= 0) return
        else if (offset > 0 && page_changer.current_page >= page_changer.pages_length -1) return
        
        page_changer.change_slide(page_changer.current_page + offset)
    },
    change_slide: (page_number) => {
        const pages = Array.from(document.querySelectorAll('[data-page]'))
        
        page_changer.pages_length = pages.length
        
        pages.forEach((page,index) => {
            page.style.display = 'none'
            if (page_number == index) {
                page.style.display = 'block'
                page_changer.current_page = index

                page_info.innerText = `${page_number + 1} of ${pages.length}`

                back_btn.disabled = false
                forward_btn.disabled = false
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            }
            if (page_number == page_changer.pages_length-1) forward_btn.disabled = true 
            else if (page_number == 0) back_btn.disabled = true 
        })
    },
    change_to_md: (file_location) => {
        menu_element.style.display = 'none'
        page_element.style.display = 'block'

        page_viewer.read_file(file_location)
        page_changer.change_slide(0)
    },
    change_to_menu: () => {
        menu_element.style.display = 'block'
        page_element.style.display = 'none'
    },
}
const menu_loader = {
    prefix: './md_files/',
    menu: [],
    import: (title, desc, src) => {menu_loader.menu.push({title, desc, src})},
    load: () => {
        menu_element.innerHTML = menu_loader.menu.map((item, index) => `
            <div class="item" onclick="page_changer.change_to_md('${menu_loader.prefix + item.src}')">
                <div class="numbered">${index+1}</div>
                <div class="text">
                    <div class="left">
                        <h1>${item.title}</h1>
                        <p>${item.desc}</p>
                    </div>
                    <div class="right">
                        <button onclick="page_changer.change_to_md('${menu_loader.prefix + item.src}')"><i class="material-icons">start</i></button>
                    </div>
                </div>
            </div>
        `).join('')
    }
}