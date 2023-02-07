@@page-start

# What is an icon?

A website icon is the small picture you see next to the title in the tab bar. For example, this website's icon is a small boring box! But before we begin we must first write our boilerplate code to get this project started.

!./md_media/tab_icon.jpg

@@page-end

@@page-start

# Boilerplate Code

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

# Adding the icon

To add an icon, we use a <link> element with a special value in the 'rel' attribute called 'icon'. This tells the computer that the data stored in this tag will tell it where to find the website's icon. Another attribute we put inside this tag is the 'href'. This stores the actual location of the image we will use as an icon.

#code-start#
<html>
    <head>
        *<link rel="icon" href="">*
    </head>
    <body>
    </body>
</html>
#code-end#

Before we can add a location for the icon, we must first find the image.

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

# Pasting the Image Address

Now paste the image address inbetween the speach marks of the 'href' attribute.

#code-start#
<html>
    <head>
        <link rel="icon" href="*https://upload.wikimedia.org/wikipedia/commons/1/15/Cat_August_2010-4.jpg*">
    </head>
    <body>
    </body>
</html>
#code-end#

When you click run, you will see that the picture is shown in the tab bar!

@@page-end

@@page-start

?? Where does a website's icon diplay?
?x In the header
?x In the search bar
?c In the tab bar
??endquiz

@@page-final