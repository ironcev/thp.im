---
title: The Variform Var
subtitle: A C# riddle. Solved with the help of contextual keywords and implicit conversion operators. 
tags: csharp riddle roslyn csharp30 csharp50 contextual-keywords implicit-conversion-operators
image: "var-var-var.png"
publishedOn: "2018-03-28T12:00:00+01:00"
lastUpdatedOn: "2018-03-28T12:00:00+01:00"
---
## *Var*ious Forms

*Var* can indeed appear in *var*ious forms. It is enough to take a look at the example below and see no more and no less then three completely different forms of *var* sharing the same line of code:

    var var = "var";

*Var* as a keyword, *var* as a *var*iable of type `string`, *var* as a string literal. [*Var*iform](https://www.merriam-webster.com/dictionary/variform) as only *var* could be. Or we could still go further? Perhaps insisting that the *var*iable *var* should be, why not, of type *var* instead of `string` ;-)

That *var* can *var*y, that we already know. But that it can *var*y so much that the above *var*iable *var* becomes an instance of *var*, that's a bit harder to imagine. Yet, that's exactly what this subtle hint in Visual Studio is telling us:

![Var var var](/resources/the-variform-var/var-var-var.png)

The *var*iable *var* is of type *var*. Which brings us to our riddle.

## The Riddle

Unlike [some other riddles on The Humble Programmer](/tags/riddle/) whose formulation spanned over several sentences and examples, this one can be easily formulated in a single sentence. Write a C# program that contains the above line of code such that the *var* *var*iable is of type *var*, whatever the type *var* is. As simple as that :-)

As with [all the riddles on The Humble Programmer](/tags/riddle/), try to solve it on your own. Don't rush, give it a try. Think of it. And most of all - don't give up too early :-)

Before you start, here is a tip that might help you. Combine the ideas from my [blog post on contextual keywords]({% post_url 2018-03-22-await-async-as-async%}#contextual-keywords) and the [blog post on the overall context]({% post_url 2018-03-24-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo%}) in which contextual keywords appear. By doing so you will already be on the half way to the complete solution ;-)

Wait!

Don't just read the text through.

Take your time and try to figure out the solution on your own.

It's not that difficult as it might appear at first ;-)

## The Solution

So, let us follow the tip and combine the two ideas that can be found in the previous two blog posts. [The first post]({% post_url 2018-03-22-await-async-as-async%}) explains that:

    var var = ...

is a perfectly valid declaration of a *var*iable of the name *var*. Hmm, now I see that we actually already assumed that from the beginning. Sorry for giving you a not so useful tip.

But [the second post]({% post_url 2018-03-24-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo%}) gives us indeed a useful clue. If there is a type called *var* somewhere in the program, the compiler will give precedence to that type over the keyword `var`. So let us declare a class called *var* and see what happens:

    class var { }

    class TheVariformVar
    {
      public void Method()
      {
        var var = "var";
      }
    }

This brings us one step further. The *var*iable *var* is now of type *var*! but the code does not compile:

![Cannot implicitly convert type 'string' to 'var'](/resources/the-variform-var/cannot-implicitly-convert-type-string-to-var.png)

The error message is pretty obvious - "Cannot implicitly convert type 'string' to 'var'". Here is where the [C# implicit conversion operators](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/implicit) come to our rescue. If we define an implicit conversion that "teaches" the compiler how to convert `string` to our newly invented type `var`, the compiler will apply the conversion and thus, the code will compile. So much for the theory.

Let's try it out. After adding the implicit conversion operator (a pretty meaningless one, but compilers usually do not insist on a deeper meaning in order to happily accept the code):

    class var
    {
      public static implicit operator var(string text)
      {
        return null;
      }
    }

    class TheVariformVar
    {
      public void Method()
      {
        var var = "var";
      }
    }

the code indeed compiles. Riddle solved :-)

## A Dynamic Homework

The purpose of this riddle was to increase our knowledge of [contextual keywords](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/index#contextual-keywords) and [implicit conversion operators](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/implicit). The best way to fortify a freshly gained knowledge is to do a bit of a homework on our own.

So here is an easy homework for you, my eager learners. Extend the below example so that it compiles and that the *var*iable *dynamic* is of type *dynamic* as shown on the screenshot:

![Dynamic dynamic dynamic](/resources/the-variform-var/dynamic-dynamic-dynamic.png)

## Confusion and Awesomeness

"The homework is trivial" I can hear you saying. "Just take the previous piece of code, replace all occurrences of *var* with *dynamic* and that's it." Yes, I agree. The solutions are identical and rely on the same C# language features. Still, those of you who did the homework and at the same time have a [ReSharper](https://www.jetbrains.com/resharper/) running, probably noticed that the second example confuses ReSharper.

By confuses I mean the following:

![Either parameter or return type must be dynamic](/resources/the-variform-var/either-parameter-or-return-type-must-be-dynamic.png)

ReSharper marks a perfectly valid C# code as invalid proving [once again]({% post_url 2018-03-22-await-async-as-async %}#facing-the-difficulty) that writing a bullet-proof C# parser/analyzer is [an extremely difficult endeavor]({% post_url 2018-03-22-await-async-as-async %}#an-extremely-difficult-endeavor). I blogged about that in a very detail in [the last chapter of my blog post "Await Async as Async"]({% post_url 2018-03-22-await-async-as-async %}#facing-the-difficulty).

Although there is no need to repeat myself here and now, there is one thing I can't repeat often enough - [Roslyn is awesome](https://github.com/ironcev/awesome-roslyn) :-) 

{% hx_src TheVariformVar %}