---
title: Clarke's Third Law Exception - Step by Step
subtitle: 'Turning the Clarke''s third law into a <a href="/stack-trace-art">Stack Trace Art</a> exception. One step at the time.'
tags: stack-trace-art step-by-step
facebook:
  picture: 'clarkes-third-law-exception-step-by-step/clarkes-third-law-exception-stack-trace-art-on-view-detail.png'
---
##Hand-making a Stack Trace Art Exception
![Clarke's First Law Stack Trace Art Exception](/resources/clarkes-third-law-exception-step-by-step/clarkes-third-law-exception-stack-trace-art-on-view-detail.png)

In my [previous post](/his-majesty-hangul-the-filler) I revealed the secret behind the [Stack Trace Art](/stack-trace-art)'s magic. It is the existence of the [Hangul Filler](http://www.fileformat.info/info/unicode/char/3164/index.htm) that makes Stack Trace Art possible. Hangul Filler is that magical Unicode character, at the same time valid in C# identifiers and 'invisible' in the same way spaces or tabs are 'invisible'. The Hangul Filler allows us to write perfectly valid C# code that looks all but valid at the first sight. The following code compiles without errors or warnings on any C# compiler! Try it on your own if you don't believe me :-)

    public class Thisㅤisㅤaㅤperfectlyㅤvalidㅤclassㅤname
    {
        public void Andㅤthisㅤisㅤaㅤperfectlyㅤvalidㅤmethodㅤname() { }
    }

<script type="text/javascript">
if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
{
    document.write
    ("<p class='alert alert-danger'>I see that you use Firefox. Unfortunately Firefox does not render the Hangul Filler properly. I'll report that to the Firefox team. Meanwhile, if you want to get a feeling how the code in this post looks like, open this web page in some other browser. I tested the page in Chrome and Internet Explorer and they both render the Hangul Filler properly. Basically, the code given above should look like this (I just replaced Hangul Fillers with spaces):</p>");
    
    document.write
    ("<pre><code>public class This is a perfectly valid class name\n" +
     "{\n" +
     "    public void And this is a perfectly valid method name() { }\n" +
     "}</code></pre>");
}
</script>
    
Let us try now to utilize our invisible character and hand-make the Stack Trace Art exception shown at the top of this post.

The whole process is very simple and straightforward. We just need a class that contains one method for sentence that we want to display on the stack trace. The methods are calling each other starting from the bottom one, up to the first one. The first one than throws the exception. As simple as that.

Here is the class:

    public class ClarkesThirdLaw
    {
        public void Anyㅤsufficientlyㅤadvancedㅤtechnologyㅤisㅤindistinguishableㅤfromㅤmagicㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ()
        {
            throw new Exception("Clarke's third law");
        }

        public void ArthurㅤCㅤClarkeㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ()
        {
            Anyㅤsufficientlyㅤadvancedㅤtechnologyㅤisㅤindistinguishableㅤfromㅤmagicㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ();
        }
    }

The client's code has to of course call the "bottom" one method:

    new ClarkesThirdLaw().ArthurㅤCㅤClarkeㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ();

If you execute the above code you will get an exception similar to this one:

![Clarke's First Law Stack Trace Art Exception - The First Step](/resources/clarkes-third-law-exception-step-by-step/clarkes-third-law-exception-stack-trace-art-first-step.png)

Awesome! Our quote appears on the stack trace indeed (underlined in green, so that you can better spot it). But as you can see, it is actually hard to notice it. All that surrounding noise (marked in red) is too strong. I'm sure you agree that a famous quote like this deserves to be displayed more clearly.

The following changes in our Stack Trace Art class will give Clarke's quote much more beauty and visibility on the client's stack trace.

###Step 1: Make the Class Name Invisible
It is easier as it sounds. We simply have to move the class out of any namespaces and give it a name that will be - the Hangul itself, what else :-) Here is the source code:

    public class ㅤ
    {
        public void Anyㅤsufficientlyㅤadvancedㅤtechnologyㅤisㅤindistinguishableㅤfromㅤmagicㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ()
        {
            throw new Exception("Clarke's third law");
        }

        public void ArthurㅤCㅤClarkeㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ()
        {
            Anyㅤsufficientlyㅤadvancedㅤtechnologyㅤisㅤindistinguishableㅤfromㅤmagicㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ();
        }
    }

The clients code will look a bit strange, but that's how it is when invisibility enters the stage:

    new ㅤ().ArthurㅤCㅤClarkeㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ();

###Step 2: Remove the Lines and Line Numbers
A simple preprocessor trick will help us here. Simply put the `#line 1 ""` preprocessor directive above every line of code that actually does something. This will remove the lines and put the line number everywhere to 1. Hmmm, at the same time this move will make every decent C# compiler suspicious. You will get plenty of CS1709 compiler warnings - Filename specified for preprocessor directive is empty. In order to calm our compiler down, we will simply silence this compiler warning by adding `#pragma warning disable 1709`.

    #pragma warning disable 1709
    #line 1 ""
    public class ㅤ
    {
    #line 1 ""
        public void Anyㅤsufficientlyㅤadvancedㅤtechnologyㅤisㅤindistinguishableㅤfromㅤmagicㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ()
        {
    #line 1 ""
            throw new Exception("Clarke's third law");
        }
    #line 1 ""
        public void ArthurㅤCㅤClarkeㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ()
        {
    #line 1 ""
            Anyㅤsufficientlyㅤadvancedㅤtechnologyㅤisㅤindistinguishableㅤfromㅤmagicㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ();
        }
    }
    #pragma warning restore 1709

Let's see how we are progressing.

![Clarke's First Law Stack Trace Art Exception - The Second Step](/resources/clarkes-third-law-exception-step-by-step/clarkes-third-law-exception-stack-trace-art-second-step.png)

Not bad at all. Our quote is much better visible now. Actually it sticks out so well, that I don't have to help it by marking it green. Still, I marked some remaining surrounding noise in red:

- Those dots that stick to first letters are really annoying.
- Having some distance between the quote and the rest of the stack trace would be nice.
- The `() in :line 1` in the first line is way to far from the sentence and makes the line unnecessary too long.

Let's fix that.

###Step 3: Add Some Margin
Adding margin is straightforward. We just have to prefix each method with few Hanguls and add a few empty lines between the rest of the stack trace and the top of the stack trace. Empty lines are, as you already guess, methods having only Hanguls in their names. The `() in :line 1`s also have to be moved a bit to some acceptable distance. How far will you you push them or in general, how big the margins are depends on the drawing and your personal taste, of course.

Here is the final Stack Trace Art class, the one that produces the exception shown at the top of this post.

    #pragma warning disable 1709
    #line 1 ""
    public class ㅤ
    {
    #line 1 ""
        public void ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ()
        {
    #line 1 ""
            throw new Exception("Clarke's third law");
        }

    #line 1 ""
        public void ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ()
        {
    #line 1 ""
            ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ();
        }

    #line 1 ""
        public void ㅤㅤㅤAnyㅤsufficientlyㅤadvancedㅤtechnologyㅤisㅤindistinguishableㅤfromㅤmagicㅤㅤㅤㅤㅤㅤㅤ()
        {
    #line 1 ""
            ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ();
        }
    #line 1 ""
        public void ㅤㅤㅤArthurㅤCㅤClarkeㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ()
        {
    #line 1 ""
            ㅤㅤㅤAnyㅤsufficientlyㅤadvancedㅤtechnologyㅤisㅤindistinguishableㅤfromㅤmagicㅤㅤㅤㅤㅤㅤㅤ();
        }

    #line 1 ""
        public void ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ()
        {
    #line 1 ""
            ㅤㅤㅤArthurㅤCㅤClarkeㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ();
        }

    #line 1 ""
        public void ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ()
        {
    #line 1 ""
            ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ();
        }
    }
    #pragma warning restore 1709

And here is the calling code. It looks weird doesn't it?

    new ㅤ().ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ();

Essentially what it does is calling the last method in the class which than calls the one above it. The call chain continues all the way to the first method which finally throws the exception.

##A Bit of Honesty
To be very honest with you, this is the first Stack Trace Art class that I manually wrote. As I [explained in my previous post](/his-majesty-hangul-the-filler#putting-it-all-together), as soon as I discovered the Hangul Filler I wrote a prototype version of the first Stack Trace Art Editor, called [stackTraceangelo](https://github.com/ironcev/stackTraceangelo). It is primitive and bad written (yeah, all those "Intentionally Bad Code" warnings are there with a good reason!) but it [helped me to create those first pieces of the Stack Trace Art](/stack-trace-art) and to have a lot of fun and joy while creating them.

I plan to write a post on how *stackTraceangelo* works and how to use it to create your own Stack Trace Art. Stay tuned :-)

{% hx_src ClarkesThirdLawExceptionStepByStep %}