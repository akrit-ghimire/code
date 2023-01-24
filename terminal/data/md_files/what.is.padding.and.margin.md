@@page-start

# Padding and Margin

When you style a website, there are two common properties you change for all elements: its padding and margin - two totally unique style rules that do things you may be familiar with.

@@page-end
@@page-start

# Boilerplate CSS

Let's first write our boilerplate code before we begin coding with CSS. Here we will use, as usual, a <div> element with a child <h1> element. We will put the <style> element inside the <head>.


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

# What is Padding?

Each element you place on a screen is a box. Some boxes are tall, some are short, some are even invisible. Padding changes the spacing of elements inside a box.

!./md_media/padding_css.png

@@page-end
@@page-start

# Using Padding in CSS

It's hard to see the difference when you change padding with both the background colour of the element and the body being the same so first let's change the background color of the <div>. Try doing that yourself (if you're stuck, the answer is on the next page).

#newline
#newline

Use this website to pick a colour.
#newline
#a# https://htmlcolorcodes.com/color-picker/

#code-start#
<html>
    <head>
        <style>
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

# Using Padding in CSS

Now under that we add the 'padding' style rule. You can use any standard unit for this however we will use pixels which is written as 'px' beside the number you choose inside the CSS style rule.
#newline
#newline
When you click run, you will see that the spacing between the text and the box change. This is what padding does.

#code-start#
<html>
    <head>
        <style>
            div {
                background-color: #A55746;
                color: white;
                *padding: 20px;*
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

# What is Margin?

Each element you place on a screen is a box. Some boxes are tall, some are short, some are even invisible. **Margin** changes the outer spacing of a box.

!./md_media/margin_css.png

@@page-end
@@page-start

# Using Margin in CSS

Under the 'padding' style rule, we will add 'margin'. Again, this uses the same units that 'padding' can use, just remember the 'px' after the number.
#newline
#newline
When you click run, you will see that the box moves away from the edge of the screen, this is because margin changes the outer spacing of a box.

#code-start#
<html>
    <head>
        <style>
            div {
                background-color: #A55746;
                color: white;
                padding: 20px;
                *margin: 20px;*
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

# Playing around

This is a new concept so play around with the values. Change the '20px' to a different number, see what happens!

@@page-end
@@page-start

?? What is padding?
?x The outer spacing of a box
?c The inner spacing of a box
??endquiz

@@page-end
@@page-start

?? What does 'px' stand for?
?x Piskels
?c Pixels
?x Pascals
??endquiz

@@page-final
