---
title: Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo
subtitle: Context matters. And creates headaches to the C# semantic analyzers.
tags: csharp riddle roslyn csharp40 csharp50 contextual-keywords
image: "buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo.jpg"
publishedOn: "2017-09-24T12:00:00+01:00"
lastUpdatedOn: "2017-09-24T12:00:00+01:00"
---
## Without Context

In [the previous blog post]({% post_url 2018-03-22-await-async-as-async %}) we discussed how [C# contextual keywords](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/index#contextual-keywords) make semantic analysis of C# code *very* difficult. It's time to discuss the *context itself* now. As you will soon see, the context can make semantic analysis even more difficult.

To demonstrate the importance of understanding and knowing the context, I'll take a few sentences in English, Naški (that's my mother tongue :-)), and German and present them to you *without* the context. All of them are perfectly valid sentences in those languages, but still, it turned out that native speakers who attended [my talk on Roslyn](https://github.com/ironcev/public-talks/tree/master/SuperPowersAndTheCompiler) had some difficulties understanding their meanings.

Let's start with the English sentence. Those of you who attended the talk will recognize the presentation slide :-) Is this below a valid English sentence? If yes, what it actually means?

![Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo](/resources/buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo/buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo.jpg)

Even if you are a native English speaker, if you've never seen the sentence before, I guess you would have a hard time understanding it. Actually, just judging if it's grammatically valid would already be a challenge. But as soon as we add a bit of a *context* around it, the mind starts figuring out the meaning.

*Buffalo* is an [animal](https://en.wikipedia.org/wiki/Buffalo). *Buffalo* is as well a [US city](https://en.wikipedia.org/wiki/Buffalo,_New_York). There is also an English [verb](https://www.merriam-webster.com/thesaurus/buffalo) *buffalo* which means *to confuse, deceive, or intimidate*. Can you now figure out the meaning? Here is the [explanation taken from the Wikipedia](https://en.wikipedia.org/wiki/Buffalo_buffalo_Buffalo_buffalo_buffalo_buffalo_Buffalo_buffalo):

![Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo - The meaning](/resources/buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo/buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-the-meaning.jpg)

The same thing is with the sentence in Naški. Is this a valid Naški sentence? If yes, what does it mean?

![Gore gore gore gore](/resources/buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo/gore-gore-gore-gore.jpg)

Again, after giving my audience a bit of a *context*, it became clear that "on higher altitudes (gore) mountains (gore) burn (gore) badly (gore)."

## With a Bit of a Context

I decided to adapt the example when I was [giving the talk in German for the first time](https://www.meetup.com/de-DE/NET-Stammtisch-Linz/events/247045584/). This time I intentionally chose a sentence that already had a bit of a context in it:

![Mit sieben Sieben sieben sieben Zwerge Mehl](/resources/buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo-buffalo/mit-sieben-sieben-sieben-sieben-zwerge-mehl.jpg)

And guess what, exactly as I expected, the audience had much less issues in interpreting the sentence. It was immediately clear that "the seven dwarfs use seven sieves to sieve the flour".

## Async Async Async Async Async

Let's switch now to C# contextual keywords and the *context* in which they appear. Those of you who already read my [last blog post]({% post_url 2018-03-22-await-async-as-async %}) can easily figure out what has to be done to make this C# method compileable:

    async async async(async async)
    {
    }
    
Yes, we just have to apply [the Robert's trick]({% post_url 2018-03-22-await-async-as-async %}#the-roberts-solution) and that's it:

    using async = System.Threading.Tasks.Task;
    
    class AsyncAsyncAsyncAsyncAsync
    {
      async async async(async async)
      {
      }
    }
    
(Well, you might be wondering now how a valid method that returns a value can exist without the `return` keyword ;-) Explaining that is out of the scope of this blog post. I might write a separate post on this topic one day.)

Right now, I am interested in one other thing. What is the *semantic* behind that method? In other words, what does it *mean*? How the compiler interprets it? What is the *meaning* of the first *async*, and of the second, and of the third, and... 

Being aware of C# contextual keywords and C# method definitions we can easily say that the first *async* is the `async` keyword, the second it the `Task` type, the third is the method name, and so on.

Now comes a tricky question, a riddle actually. Could it be any different? Is this above *the only possible semantical interpretation* of that code? Or we could also potentially have different ones? And if yes, how?!

I'am afraid I am becoming a bit too abstract now :-) So let's switch to the next example which better formulates my tricky question.

## Dynamic Dynamic Dynamic Dynamic Dynamic

A similar exercise again. Is this a valid C# method?

    dynamic dynamic(dynamic dynamic) => dynamic;

I guess by now you are starting to wonder from where I am getting all these crazy examples :-) Well, I have a few of them and they are all, modesty aside, a product of my own thinking. From the very first moment I read about C# contextual keywords in brothers Albahari's excellent book [C# 5.0 in a Nutshell](http://shop.oreilly.com/product/0636920023951.do) I've started creating these wild examples.

Back to the tricky question.

Yes, it is a valid C# method. By now we all now this. But allow me to ask you - what it *means*? What is the *semantic* behind each of the *dynamic*s?

Well, it's quite obvious, you will say, isn't it? The first *dynamic* is the [`dynamic` keyword](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/dynamic), the second is the method name, the third again the keyword, the forth the parameter name, and the fifth again the same parameter name. It can't be any simpler.

Great! I see you've learned the contextual keywords lesson well :-)

But... are you *sure*? Are you *100% sure* that the above interpretation of the method semantics is *the only one possible*? Let me rephrase the question, because it might be confusing. Can we have that same valid C# method in our code, but with different meanings of those *dynamic*s? Yes, [again]({% post_url 2018-03-22-await-async-as-async %}) a riddle :-)

## The Riddle

As with [all the riddles on The Humble Programmer](/tags/riddle/), try to solve it on your own. Don't rush, give it a try. Think of it. Don't give up to early :-)

Again, is it possible to write a piece of code that gives us a  *different semantics* for  this method:

    dynamic dynamic(dynamic dynamic) => dynamic;

then the one already presented above?

OK, I hope you didn't give up too quickly. If you've found the solution on your own, just scroll down to the next chapter. If not, let's try to solve it together.

The last *dynamic* must be an identifier. To be precise, the parameter of the method. Even if we had e.g. a class field called *dynamic*, the parameter would win. What about the two *dynamic*s in the brackets? According to the C# specification of a method declaration, the first one must be a type, and the second one the parameter name. We have a similar situation with the very first two *dynamic*s - the first one is the type and the second one the method name.

It is clear now, that the only thing we can "vary" are the two occurrences of a type. The rest are for sure identifiers.

What will happen if we declare a class called *dynamic* like in the code given below?

    class dynamic { }
    
    class DynamicDynamicDynamicDynamicDynamic
    {
      dynamic dynamic(dynamic dynamic) => dynamic;
    }

Here is where [the story about the contextual keywords]({% post_url 2018-03-22-await-async-as-async %}#contextual-keywords) comes in play. The keyword `dynamic` appeared for the first time in the [C# 4.0](https://en.wikipedia.org/wiki/C_Sharp_4.0). And before that happened, it might be that we had classes in the existing C# code that were called *dynamic*. In order not to change the semantic of the existing code the compiler will in such cases give precedence to that class over the keyword `dynamic`. Which brings us to the following conclusion.

The first and the third *dynamic*s do not represent any more the `dynamic` keyword. Rather, they are occurrences of the class *dynamic*. And that, of course, suddenly gives a completely different meaning to our original line of code!

## Context Matters

Let me [re-quote]({% post_url 2018-03-22-await-async-as-async %}#an-extremely-difficult-endeavor) Jason Bock and *controlflow*.

> The compiler needs to figure out semantics for these tokens based on the rules of the C# language, and if you've ever read the C# specification, you know that this can be an **extremely difficult endeavor**.<br/><br/>[Jason Bock](https://twitter.com/jasonbock), [.NET Development Using the Compiler API](https://www.apress.com/gb/book/9781484221105) (emphasized by me)

&nbsp;

> Parsing is really really cheap comparing to semantic resolution (ask Roslyn folks).<br/><br/>*controlflow* in his comment on: [ReSharper and Roslyn: Q&A](https://blog.jetbrains.com/dotnet/2014/04/10/resharper-and-roslyn-qa/#comment-75849)

&nbsp;

I hope you agree with me when I say that contextual keywords are a good example of how difficult a semantic resolution of a piece of a C# code actually is. When it comes to contextual keywords, it is not only the immediate context they appear in that denotes the meaning of the code. In order to derive the proper semantics the compiler has to be aware of the *overall surrounding context*. Well, strictly speaking, the compiler has to be aware of the overall surrounding context no matter what kind of code it compiles at the moment.

Moreover, anyone who wants to write any kind of C# code semantic analysis on its own has to be aware of the overall context as well. And not only of the overall context but also of a myriad of other subtleties described in the [not so exactly up-to-date C# specification](https://github.com/dotnet/csharplang/tree/master/spec).

Which again brings me to the awesomeness of Roslyn.

Being able to see C# code through the eyes of the C# compiler "for free" is, in my opinion, one of the greatest gifts we got from the C# compiler team. In [my talk on Roslyn](https://github.com/ironcev/public-talks/tree/master/SuperPowersAndTheCompiler) I discuss how to utilize this generous gift to increase the code quality of our own code. But that's a whole other topic, way out of the scope of this blog post.

I hope that my [posts on Roslyn](/tags/roslyn/) will make you curious and motivate you to try Roslyn on your own :-)

{% hx_src BuffaloBuffaloBuffaloBuffaloBuffaloBuffaloBuffaloBuffalo %}