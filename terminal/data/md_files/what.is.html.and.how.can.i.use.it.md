@@page-start

# What is HTML?

HTML is a coding language (type) that's used to make websites that you find on the internet. This language is used to define the structure of a website eg. should a website have an image? should the image go before the title? should it go after the paragraph? That sort of thing. 

@@page-end

@@page-start

# HTML elements

HTML code is made up of elements which are building blocks of the website. An element generally is made up of 3 things, a start tag, the content and an end tag.

!./md_media/html_tag_explainer.png

The opening tag may have more than one attributes (key value pairs) included inside the tag. An example of this is the 'class' attribute.

!./md_media/html_tag_attribute_explainer.png

The closing (end) tag has a forward slash before the tag name. In most cases you will need a closing tag, however some tags are self contained and do not need a closing tag.

#newline
#newline

The content goes in between the start and end tag. The content could be text or it could have more HTML elements inside which are called children.

@@page-end

@@page-start

?? What 3 things are HTML elements made up of?
?x Atomic numbers, Viscosity, 2 letter symbol
?c A start tag, an end tag and content in between
?x a https protocol, an absolute address and an internet connection
??endquiz

@@page-end

@@page-start

?? What are attributes?
?x Keys and Keyholes
?x A property that is found inside of general text
?c A key value pair that is included inside the start tag
??endquiz

@@page-end

@@page-start

?? What things could you include inside of an element?
?c Some text or more HTML elements
?c An attribute (a key value pair)
?c A start and end tag 
??endquiz

@@page-end

@@page-start

# Let's make a website

Now that we've got all that boring but important theory out of the way, let's start making websites. 

#newline
#newline

Start by writing out this element into the textbox to your left.

#code-start#
<html>
</html>
#code-end#

Notice how the element has a start tag and an end tag.

?? What is missing from the element?
?c Some content
?x Some end tags
?x A picture
??endquiz

@@page-end

@@page-start

# Adding some more HTML elements

Next we need to add some important children (HTML elements) to the website. <head> and <body>

#code-start#
<html>
    *<head>*
    *</head>*
    *<body>*
    *</body>*
</html>
#code-end#

The <head> element contains things that aren't directly shown in the webpage like the title that you see in the tab bar. It's always good practice to change the title that is shown on the tab bar as it makes a website more professional.

#code-start#
<html>
    <head>
        *<title>Hello World</title>*
    </head>
    <body>
    </body>
</html>
#code-end#

Click run to see what this does.
!./md_media/run_website.gif

@@page-end

@@page-start

# The body of the website

The body element contains elements that the user can see and interact with. Pretty much all the elements you will learn about go inside this tag. The below code will put text on screen.

#code-start#
<html>
    <head>
        <title>Hello World</title>
    </head>
    <body>
        *<p>Hello World</p>*
    </body>
</html>
#code-end#

The <p> element is nested (put inside of) the <body> element. It has a start tag <p>, and an end tag </p> and content in the middle: 'Hello World'.

@@page-end

@@page-start

# How to add more text on screen?

To add more text, you need to add more text elements eg add another <p> element and change the content of it to show the text that you want.

#code-start#
<html>
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <p>Hello World</p>
        *<p>Hello Moon</p>*
    </body>
</html>
#code-end#

@@page-end

@@page-start

?? What does the <title> element do?
?x Adds some text to the website
?c Changes the text on the tab bar
?x Adds a picture to the website
??endquiz

@@page-end

@@page-start

?? What does the <body> element do?
?x It groups together all the content that isn't directly seen with or interacted with by the user
?c It groups together all the content that can be seen and interacted with by the user
??endquiz

@@page-end

@@page-start

?? What 3 things are HTML elements made up of?
?x Atomic numbers, Viscosity, 2 letter symbol
?c A start tag, an end tag and content in between
?x a https protocol, an absolute address and an internet connection
??endquiz

@@page-end

@@page-start

# Where next?

Alright. So you've made your first ever website. Are you done with the club now or are you willing to learn more? If yes, continue on. The next few tutorials will teach you how to add different but familiar elements on screen eg a picture, a link, a bullet point list, a heading... 

?? Are you ready for the challenge?
?c Yes!
?c Absolutely!
?c Definitely!
??endquiz

@@page-final