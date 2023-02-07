@@page-start

# Copying a BBC News Box

When you visit the BBC, you will find that all their article/news page links are displayed as boxes e.g. the image below

!./md_media/bbc_demo.jpg

You now have enough CSS knowledge to be able to copy one of these boxes!


@@page-end
@@page-start

# Boilerplate Code

As per ususal, before we begin any project, we need to write some boilerplate code to get our project started. Copy the below code.


#code-start#
<html>
    <head>
        <style>
        </style>
    </head>
    <body>
    </body>
</html>
#code-end#

@@page-end
@@page-start

# The HTML Part

Next let's write the HTML for this project. But where to begin? This reference image may look complicated at first but we just need to break it down into smaller components that we know how to code.

!./md_media/bbc_demo.jpg

When you look at the image, you will notice that there is a white box that stores all the other components, we will use a <div></div> to represent this.

#code-start#
<html>
    <head>
        <style>
        </style>
    </head>
    <body>
        *<div>*
        *</div>*
    </body>
</html>
#code-end#

@@page-end
@@page-start

# The HTML Part

Next, you will notice that inside this big white box, there are two smaller sections of the card, one section is an image and another is a section that contains some text. This can be written in HTML by adding an <img> tag and the respective text tags as shown below.


#code-start#
<html>
    <head>
        <style>
        </style>
    </head>
    <body>
        <div>
            *<img>*
            *<h2>How much screen time is too much for children?</h2>*
            *<p>BBC Bitesize</p>*
        </div>
    </body>
</html>
#code-end#

@@page-end
@@page-start

# The CSS Part

Now that we have all the HTML written, it is time to add colour and style to the website. To begin, we will give the background that light grey colour and give the website a bit of padding (spacing on the edges). We will add these styles to the <body> tag. The '#f3f3f3' is the colour code for the light grey color we are using.

#code-start#
<style>
    body {
        background-color: #f3f3f3;
        padding: 16px;
    }
</style>
#code-end#

Next we will style the background color of the <div> element to be white so that it doesn't blend into the background. We will also set the width of this element to be 400 pixels so it doesn't take up all the space on screen.

#code-start#
<style>
    body {
        background-color: #f3f3f3;
        padding: 16px;
    }

    *div* {
        background-color: white;
        width: 400px;
    }
</style>
#code-end#

@@page-end
@@page-start

# The CSS Part

Now let's style the text elements to look like our reference image. Both the <h2> and the <p> tags have the 'font-size' and 'font-family' style rules. The font sizes are different depending on the text component so it matches the BBC article card we are trying to copy. This new style rule 'font-family' just means change the text font. We will set this to 'sans-serif' which means make it look less pointy and more smooth.

#code-start#
<style>
    body {
        background-color: #f3f3f3;
        padding: 16px;
    }

    div {
        background-color: white;
        width: 400px;
    }

    *h2* {
        *font-size: 22px;*
        *font-family: sans-serif;*
    }
    *p* {
        *font-size: 16px;*
        *font-family: sans-serif;*
    }
</style>
#code-end#

To the <h2> tag, we will add another new style rule which is 'font-weight' and we will set it to 'bold'. You may have guessed it already but what this does is change the <h2> text to bold!

#code-start#
<style>
    body {
        background-color: #f3f3f3;
        padding: 16px;
    }

    div {
        background-color: white;
        width: 400px;
    }

    *h2* {
        font-size: 22px;
        font-family: sans-serif;
        *font-weight: bold;*
    }
    p {
        font-size: 16px;
        font-family: sans-serif;
    }
</style>
#code-end#

Next, we will change the color of the <p> text to grey as this is the colour shown in the image.

#code-start#
<style>
    body {
        background-color: #f3f3f3;
        padding: 16px;
    }

    div {
        background-color: white;
        width: 400px;
    }

    h2 {
        font-size: 22px;
        font-family: sans-serif;
        font-weight: bold;
    }
    *p* {
        font-size: 16px;
        font-family: sans-serif;
        *color: gray;*
    }
</style>
#code-end#

@@page-end
@@page-start

# The CSS Part

If you click run, you will see that there's one thing missing for our text section compared to the image text section and that is the spacing between the text and the white box it is in.

We will add some padding to our text CSS styles to replicate this.

#code-start#
<style>
    body {
        background-color: #f3f3f3;
        padding: 16px;
    }

    div {
        background-color: white;
        width: 400px;
    }

    h2 {
        font-size: 22px;
        font-family: sans-serif;
        font-weight: bold;
        *padding: 20px;*
    }
    p {
        font-size: 16px;
        font-family: sans-serif;
        color: gray;
        *padding: 20px;*
    }
</style>
#code-end#

You'll notice that in the image, the title text is further away from the little text compared to your website. To replicate this we will add some margin to the <h2> tag. We will give it 0 pixels margin for the top of the tag and 30 pixels of margin for the bottom of it, this will create the space between the big text and the little text.

#code-start#
<style>
    body {
        background-color: #f3f3f3;
        padding: 16px;
    }

    div {
        background-color: white;
        width: 400px;
    }

    h2 {
        font-size: 22px;
        font-family: sans-serif;
        font-weight: bold;
        padding: 20px;
        *margin-top: 0px;*
        *margin-bottom: 30px;*
    }
    p {
        font-size: 16px;
        font-family: sans-serif;
        color: gray;
        padding: 20px;
    }
</style>
#code-end#

@@page-end
@@page-start

# Add The Image

Last thing we need to do is add the image to the article/news card. We do this by putting the source (src) of the image file inside the tag. We will also change the width and height of it so it doesn't look absolutely massive onscreen.

#code-start#
<img src="https://ichef.bbci.co.uk/images/ic/608xn/p0f0nxhj.jpg" width="400px" height="200px">
#code-end#

@@page-end
@@page-start

# Reflection

Now it's time to compare our work with the original. How close were we? Does your website look similar to the style the BBC use in their own websites?

!./md_media/bbc_demo.jpg

@@page-final
