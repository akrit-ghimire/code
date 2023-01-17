@@page-start

# Getting started with CSS

Type this into the main box:

#code-start#
<html>
    <head>
    </head>
    <body>
        <div>
            <h1>hello</h1>
        </div>
    </body>
</html>
#code-end#

When you click run, as expected, it will look a bit boring, let's change that.

@@page-end
@@page-start

# Getting started with CSS

To add some styles to the website with CSS, we use the 'style' element. This goes inside the 'head' element. This is where we will write all our CSS code.


#code-start#
<html>
    <head>
        *<style>*
        *</style>*
    </head>
    <body>
        <div>
            <h1>hello</h1>
        </div>
    </body>
</html>
#code-end#

@@page-end
@@page-start

# Adding a background color

To add a background color, we first need to tell the computer what element to add the background color to. We do this by writing the element name (in this case 'body') followed by two curly brackets.

#code-start#
<html>
    <head>
        <style>

            *body {*

            *}*

        </style>
    </head>
    <body>
        <div>
            <h1>hello</h1>
        </div>
    </body>
</html>
#code-end#

@@page-end
@@page-start

# Adding a background color

We now write a style rule inside the curly brackets that changes the background color.

#code-start#
<html>
    <head>
        <style>

            body {
                *background-color: blue;*
            }

        </style>
    </head>
    <body>
        <div>
            <h1>hello</h1>
        </div>
    </body>
</html>
#code-end#

What this tells the computer to do is: look for the element with the name 'body'; then change its background color to 'blue'.

@@page-end
@@page-start

# Adding a different background color

But what if you want another color for the background? Just change out the 'blue' for a color code.
#newline
#newline
But what are color codes? Essentially, a colour code, is a code that represents a colour. You can find them here:
#a# https://htmlcolorcodes.com/color-picker/
#newline
#newline
First pick a colour by moving the circle in the middle of the colourful box.
!./md_media/adding_color_css_1.jpg
Then copy its color code.
!./md_media/adding_color_css_2.jpg
Go back to your code and change the 'blue' for your chosen colour. You will need to add a hashtag (#) before the code to let the computer know that you are using a colour code.

#code-start#
<html>
    <head>
        <style>

            body {
                background-color: *#*A55746;
            }

        </style>
    </head>
    <body>
        <div>
            <h1>hello</h1>
        </div>
    </body>
</html>
#code-end#

@@page-end
@@page-start

# Adding colour to text

You may notice that the text doesn't look that good on this colour, so let's change the color of the text to make it a little more easy on the eyes.
#newline
#newline
We do this by adding another style rule below the 'background-color' style rule. This one is called 'color' and it will change the color of all text elements inside the body element. We do the exact same thing as we did with background color by choosing a color we want our text to have. I will use 'white' for this website.

#code-start#
<html>
    <head>
        <style>

            body {
                background-color: #A55746;
                color: white;
            }

        </style>
    </head>
    <body>
        <div>
            <h1>hello</h1>
        </div>
    </body>
</html>
#code-end#
When you run this code, you should see that both the background color and text color have been changed.

@@page-end
@@page-start

?? Where does the <style> element go?
?c Inside the <head> elment
?x Inside the <h1> element
?x Inside the <body> element
??endquiz

@@page-end
@@page-start

?? What is this a form of: '#AAd233?
?x An HTML code
?x A Java Script code
?c A colour code
??endquiz

@@page-end
@@page-start

# Next steps

Using your knowledge of background and text colours, change the background color of the <div> element. A portion of the code has been done for you.
#newline
#newline
Use this website to pick a colour.
#newline
#a# https://htmlcolorcodes.com/color-picker/

#code-start#
<html>
    <head>
        <style>

            body {
                background-color: #A55746;
                color: white;
            }

            *div {*

            *}*

        </style>
    </head>
    <body>
        *<div>*
            <h1>hello</h1>
        *</div>*
    </body>
</html>
#code-end#

@@page-final
