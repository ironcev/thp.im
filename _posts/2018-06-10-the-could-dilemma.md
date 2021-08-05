---
title: "The <em>Could</em> Dilemma"
subtitle: "Static code analysis is tough. Covering cases that <em>could</em> but <em>don't</em> appear in code make it even tougher."
tags: static-code-analysis impression sharpen
image: "the-could-dilemma.jpg"
publishedOn: "2018-06-10T12:00:00+01:00"
lastUpdatedOn: "2018-06-10T12:00:00+01:00"
---
## *Could*, the Troublemaker

Static code analysis is tough. In two of my previous posts, [Await Async as Async]({% post_url 2018-03-22-await-async-as-async %}) and [The Variform Var]({% post_url 2018-03-28-the-variform-var %}), I mentioned the difficulties that the [ReSharper](https://www.jetbrains.com/resharper/) team faces when analyzing C# code. Understanding that someone else has difficulties analyzing C# code and experiencing those difficulties on my own skin turned out to be two completely different things. Unlike the ReSharper team I do not parse C# on my own. I delegate this job to [Roslyn](https://github.com/ironcev/awesome-roslyn). But even though I get the parsing and the semantics for free, doing static code analysis on top of Roslyn is still far from trivial.

In my experience, writing happy path analysis is usually not so complex. Covering corner cases  is what makes the effort (and the head) explodes. The amount of crazy constructions that *could* appear in a perfectly valid C# code is simply to say - vast. Facing this vastness is all but easy. In practice, what causes me trouble when doing static code analysis is what I call the "The *Could* Dilemma".

## The *Could* Dilemma Explained

The *Could* Dilemma is fairly simple to explain. It narrows down to the following question.

What to do when we realize that some crazy constellation *could* appear in code, although we know that it's very unlikely that it *will* every appear in a real life code?

Should our static analysis simply ignore that crazy corner case? Or should we strive to cover it no matter how improbable it is? Should this decision be made on a per-case basis? If yes, what are the criteria for making such a decision?

To make the dilemma more concrete I'll take the [Sharpen](http://sharpen.rocks)'s "Use nameof expression in dependency property declarations" suggestion as an example. Programming this suggestion produced a strong [impression](/tags/impression/) that actually triggered this blog post. Although I faced The *Could* Dilemma many times before, it culminated during the implementation of the suggestion. It culminated because what at first seamed to be a simple and quick analysis to write turned into a couple of hours of work. Most of those hours were spent pondering about what to do with the cases that *could* occur, but *will* most likely never occur in code.

## The *Could*-s of Declaring Dependency Properties

If you've ever had a chance to define a [dependency property](https://docs.microsoft.com/en-us/dotnet/framework/wpf/advanced/dependency-properties-overview) on your own, I am 101% sure that your code looked similar to this one:

    static readonly DependencyProperty MyDependencyProperty =
        DependencyProperty.Register
        (
            "MyDependency", typeof(int), typeof(MyClass)
        );

The "Use nameof expression in dependency property declarations" suggests to replace the hardcoded property name with its `nameof` equivalent:

    nameof(MyDependency), typeof(int), typeof(MyClass)

Implementing the suggestion was supposed to be simple. Find `static` `readonly` fields that are initialized with the `Register()` method. It can't be simpler than that. An hour of work at most. Including detailed smoke testing.

It turned out it wasn't that way. A chain of *could*-s turned the planned straightforward implementation into a lot of uneasy decision making.

### Declaring Several Dependency Properties in a Single Field Declaration 

Here is the first *could* that came to my mind. One *could* put more then one dependency property in a single field declaration:

    static readonly DependencyProperty
        MyFirstDependencyProperty = DependencyProperty.Register
        (
            "MyFirstDependency", typeof(int), typeof(MyClass)
        ),

        MySecondDependencyProperty = DependencyProperty.Register
        (
            "MySecondDependency", typeof(int), typeof(MyClass)
        ),

        MyThirdDependencyProperty = DependencyProperty.Register
        (
            "MyThirdDependency", typeof(int), typeof(MyClass)
        );

In case your jaw has just dropped right now and you are asking yourself if this syntax is a valid C# at all, let me tell you that you are surely not the only one being confused. I'm ready to put my hand in the fire for the claim that most C# programmers are completely unaware of the fact that a single C# field declaration can declare several fields at once, e.g.:

    private int firstField, secondField, thirdField;

Have you ever seen a declaration like that in a real-life code? I haven't. I know that such a declaration is possible in theory but I've personally never seen it in practice. Never ever. In my part of the C# Universe fields are always declared separately, one by one.

And this is especially true when it comes to dependency properties. I strongly doubt that anyone ever diverged from the canonical example of a dependency property declaration.

### Declaring Dependency Properties in the Static Constructor

My *could* chains rarely consist of a single link. The *Could* Dilemma is like a can of worms. Once you open it, the worms will start coming out, bringing a more and more crazy *could-be* corner cases. Corner cases like this one:

    static MyClass()
    {
        MyDependencyProperty = DependencyProperty.Register
            (
                "MyDependency", typeof(int), typeof(MyClass)
            );
    }


Unusual as it is, improbable as it is, it is a perfectly valid C# code. Programmers *could* register their dependency properties in static constructors instead, as universally advertised, in field declarations. They *could* but we know that they don't. Or do they?

It is only my (strong ;-)) experience telling me that no one is doing this in real life code.

### Supporting Other `Register()` Methods

After [running the Sharpen's v0.5.0 Endgame](https://github.com/sharpenrocks/Sharpen/wiki/Endgame-for-v0.5.0) Robert Kurtanjek pointed out in his feedback that [the other `Register()` methods](https://msdn.microsoft.com/en-us/library/system.windows.dependencyproperty.registerreadonly(v=vs.110).aspx) should be covered as well:

> Budući da si dodao suggestion za DependecyProperty.Register, vrlo je jeftino dodati i isti suggesition za ostale Register metode.
>
> Moram priznati da nikad nisam koristio RegisterReadOnly te RegisterAttachedReadOnly, ali RegisterAttached sam koristio :)
>
> Koliko vidim, na jednom mjestu je hardkodiran "Register" kao ime metode, tako da je vjerojatno lako dodati i ostale metode, no kad se na to doda i testing effort, možda se i ne isplati (budući da se te metode rijetko koriste).

To summarize his feedback, Robert at first believes that it should be very cheap (vrlo jeftino) to add other `Register()` methods. He points out that he has never used the [`RegisterReadOnly()`](https://msdn.microsoft.com/en-us/library/system.windows.dependencyproperty.registerreadonly(v=vs.110).aspx) and the [`RegisterAttachedReadOnly()`](https://msdn.microsoft.com/en-us/library/system.windows.dependencyproperty.registerattachedreadonly(v=vs.110).aspx) methods, but that he did use the [`RegisterAttached()`](https://msdn.microsoft.com/en-us/library/system.windows.dependencyproperty.registerattached(v=vs.110).aspx). Finally he slightly changes his mind and concludes that the additional testing effort maybe makes the support for these methods more expensive then the gain is (možda se i ne isplati), because "those methods are used very rarely".

Robert's feedback perfectly summarizes the back-and-forth I experience when faced with The *Could* Dilemma.

The fact that I'm aware of a case that *could* appear in code makes me feel obliged to support it. But there is an additional effort involved, often not a trivial one. Is the gain of supporting the corner case really worth that effort?

And so, back to the question, how to deal with The *Could* Dilemma? Below is the best answer I came up with so far.

## Dealing With The *Could* Dilemma

There is a kind of a fuzzy decision tree I tend to follow when I want to get out of that endless back-and-forth.

If the support for the corner case is trivial, I add it without thinking too much. If the implementation or testing effort is considerable or high I try to judge how big is the penalty of not supporting the corner case. If the lack of support results in a neglectable percentage of valid cases not being reported by Sharpen, that's a price I am ready to pay. If it could result in a false positive I consider it to be a much serious consequence. The existence of a possible false positive increases for me the importance of supporting the corner case.

But in both cases, I tend to postpone the implementation for future releases in order not to slow down the release cycle of Sharpen because of corner cases that are anyhow unlikely to happen. In the worst case, I am ready to wait until someone reports a bug that comes out of the fact that a corner case is not supported.

In our example of dependency property declarations, I came up with a simple algorithm that covers both the main use case and the corner case of having multiple dependency properties in a single field declaration. Thus, [Sharpen v0.5.0](https://github.com/sharpenrocks/Sharpen/releases/tag/v0.5.0) already supports both cases although the second one is highly unlikely to happen. The constructor case is also rather simple, but requires effort. The same is with the support for the other `Register()` methods. Thus, I will add that support in the future versions of Sharpen but will not necessarily hurry to do it.

That's roughly how I deal with The *Could* Dilemma at the moment. Did you ever experience The *Could* Dilemma on your own? If yes, what are your approaches for solving it?

## All the Code in the World

A bit off-topic, but still worth mentioning. Google [indexed all the open source code on GitHub](https://cloud.google.com/bigquery/public-data/github) and made it queryable via its [BigQuery](https://cloud.google.com/bigquery/). Why am I mentioning this?

The assumptions made in this blog post, that certain possible but very unlikely patterns in code do not exist in the wild, are based purely on my experience. That experience includes hundreds of thousands of lines of code collected over the years in my head. But as every human experience, it is still very limited in its nature.

Therefore I plan to test such assumptions in the future by statically analyzing what I like to call "all the code in the World". By combining Google's [Big Query](https://cloud.google.com/bigquery/) and [Roslyn](https://github.com/ironcev/awesome-roslyn) many of these assumptions could be either supported or rejected by a precise statistical analysis of "all the code in the World". So stay tuned :-)

{% hx_src TheCouldDilemma %}