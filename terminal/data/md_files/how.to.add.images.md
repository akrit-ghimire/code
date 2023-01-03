@@page-start

# Why do we display images?

Whether it be to showcase a product better or simply make the website look nicer, images (pictures) contribute far more than general text could to the look and feel of a website. As they say, a picture tells a thousand words!

@@page-end

@@page-start

# Start with boilerplate

For every website you will always need to write up the same code before you can code what you want, this is called writing boilerplate code. Copy the below into the textbox on the left.

#code-start#
<html>
    <head>
    </head>
    <body>
    </body>
</html>
#code-end#

@@page-end

@@page-start

# Setting up the image

Unlike the other elements you've learnt, the <img> tag does not require a closing tag because it is a self-contained tag. However, it does need attributes (key value pairs inside the start tag). 

#code-start#
<html>
    <head>
    </head>
    <body>
        *<img>*
    </body>
</html>
#code-end#

When you run the above code, no image appears. This is because you've not told the computer which image to display. So let's go find an image to display.

@@page-end

@@page-start

# Finding an image

To find an image we will use google 
#a# https://www.google.com
#newline
Find a cat picture and copy its **image address**

!./md_media/copy_image_address.gif

@@page-end

@@page-start

# The source (src) attribute

Now to tell the computer which image to display we are going to paste the image address into the src (source) attribute. This attribute is written inside of the start tag and is what tells the computer where to look for the image.

#code-start#
<html>
    <head>
    </head>
    <body>
        <img *src="https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png"*>
    </body>
</html>
#code-end#

@@page-end

@@page-start

# Changing the image size

When you run the code you will see your image display (if not, try and spot why before asking for help). The image may appear larger than you would like so let's change that. To do this we will add some more attributes inside the start tag that gives the computer more instructions on what to do with the image.

#code-start#
<html>
    <head>
    </head>
    <body>
        <img 
            src="https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png"
            *width="400px"*
            *height="400px"*
        >
    </body>
</html>
#code-end#

The width="400px" means to display the image 400 pixels wide. To change the size of this, only change the number, leave the 'px' units alone.

@@page-end

@@page-start

?? What does a self-contained element mean?
?x The element needs a container
?c The element does not need a closing tag
?x The element does not need a start tag
??endquiz

@@page-end

@@page-start

# Challenge yourself

This is quite a tricky thing to do. Practice by **adding a dog picture** to the website aswell.

@@page-end

@@page-start

# Next steps

You've learnt how to display images to your website, now lets learn how to change that icon in the tab bar!

@@page-final