@@page-start

# Why lists?

There may be a scenario where you need to rank items and display them on a website (eg. top three places to visit this summer) or bullet point a whole bunch of items (eg. ingredients for a shopping list). Although this may sound a bit complicated (or not), it is pretty simple to do.

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

# Displaying a bullet point list

We use the <ul> tag as a container to display our list. 'ul' stands for unordered list. 

#code-start#
<html>
    <head>
    </head>
    <body>
        *<ul>*
        *</ul>*
    </body>
</html>
#code-end#

@@page-end

@@page-start

# Adding list items

Whether a bullet point list or a numbered list, the element we use for each item of the list is the same, it is the <li> element. 'li' stands for list item. Inside your <ul> element, include some 'children' <li> elements.

#code-start#
<html>
    <head>
    </head>
    <body>
        <ul>
            *<li>This is a list item</li>*
        </ul>
    </body>
</html>
#code-end#

This will display a single bullet point on screen. Let's add some more bullet points. To do this we add more <li> elements inside the <ul> element.

#code-start#
<html>
    <head>
    </head>
    <body>
        <ul>
            <li>This is a list item</li>
            *<li>This is aanother list item</li>*
            *<li>This is aanother list item</li>*
        </ul>
    </body>
</html>
#code-end#

But what if we want to number these items instead?

@@page-end

@@page-start

# Displaying a numbered list

The process is almost identical to making a bullet point list, there's only one difference: instead of <ul> we change the tag to <ol>. 'ol' stands for ordered list. This will change the bullet points into numbers. This will display a numbered list.

#code-start#
<html>
    <head>
    </head>
    <body>
        <*ol*>
            <li>This is a list item</li>
            <li>This is aanother list item</li>
            <li>This is aanother list item</li>
        </*ol*>
    </body>
</html>
#code-end#

@@page-end

@@page-start

?? What does the <li> element stand for?
?x Long intestine
?x List index
?c List item
??endquiz

@@page-end

@@page-start

# Challenge yourself!

Practice displaying some of your own lists eg your top 10 favourite foods or a recent shopping list.

@@page-end

@@page-start

# Next steps

Now that you've learnt how to add bullet points, let's try something more challenging: adding images to your websites!

@@page-final