const md = {
    parse: (text) => {
        const toHTML = text
        
        .replace(/>/gim, '&gt;')
        .replace(/</gim, '&lt;')
        .replace(/^@@page-final/gim, '</div>') // final so no next button shows
        .replace(/^@@page-end/gim, '<button class="next" onclick="app.loader.page_next()">next page <i class="material-icons">arrow_forward</i></button></div>') // end page
        .replace(/^@@page-start/gim, '<div data-page style="display: none">') // start page

        .replace(/^#code-end#/gim, '</pre></code>') // end code
        .replace(/^#code-start#/gim, '<code><pre>') // start code

        .replace(/^#a#(.*$)/gim, '<a href="$1" target="_blank">$1</a>') // link
        .replace(/^- (.*$)/gim, '<li>$1</li>') // list
        .replace(/^#newline/gim, '<br>') // new line
        
        .replace(/^!(.*$)/gim, '<img src="./data/$1">') // h3 tag
        .replace(/^### (.*$)/gim, '<h3>$1</h3>') // h3 tag
        .replace(/^## (.*$)/gim, '<h2>$1</h2>') // h2 tag
        .replace(/^# (.*$)/gim, '<h1>$1</h1>') // h1 tag
        .replace(/\*\*\*(.*)\*\*\*/gim, '<i>$1</i>') // italic text
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>') // bold text
        .replace(/\*(.*)\*/gim, '<span class="highlight">$1</span>') // highlight text

        return toHTML.trim(); // using trim method to remove whitespace
        // code originally by Randolph Perkins - Medium Article
    },
    display: (markdown_data) => {
        const markdown = document.querySelector('md')
        markdown.innerHTML = md.parse(markdown_data)
    },
    read: (file) => {
        const f = new XMLHttpRequest()
        console.log(file)
        f.open("GET", `./data/md_files/${file}`, false)
        f.onreadystatechange = () => {
            if (f.readyState === 4 && (f.status === 200 || f.status == 0)) md.display(f.responseText) 
        }
        f.send(null)
    }
}