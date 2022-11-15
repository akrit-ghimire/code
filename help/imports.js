// import pages
menu_loader.import(
    title='Lesson 1: The Basics', 
    desc='What is HTML? You will learn this as well as making your first ever website!', 
    src='1.what.is.html.md'
)
menu_loader.import(
    title='Poem Activity', 
    desc="Practice the skills you've learnt from Lesson 1 by making a website that displays a poem.", 
    src='2.poem.activity.md'
)
menu_loader.import(
    title='Lesson 2: Tags', 
    desc="You will learn other components that can be added to a website eg. an image, a heading, a list and others more!", 
    src='3.what.are.tags.md'
)
menu_loader.import(
    title='Movie Activity', 
    desc="Practice the skills you've learnt from Lesson 1 by making a website that displays information about a movie", 
    src='4.movie.activity.md'
)
menu_loader.import(
    title='Project 1: Cat Toy Shop', 
    desc="You will tie together all the things you have learnt so far by making a cat toy shop website for Olivia", 
    src='5.project.cat.toy.shop.md'
)
// load the menu
menu_loader.load()
page_changer.change_to_menu()