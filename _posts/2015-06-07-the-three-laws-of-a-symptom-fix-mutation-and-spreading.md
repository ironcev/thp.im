---
title: 'The Three Laws of a Symptom Fix - Mutation and Spreading'
subtitle: 'The <a href="/the-three-laws-of-a-symptom-fix#the-second-law-a-symptom-fix-will-mutate-and-spread">Second Law of a Symptom Fix</a>, illustrated on a concrete example'
description: This blog post illustrates The Second Law of a Symptom Fix on a concrete example.
keywords: symptom fix
tags: bugs symptom-fix symptom-fix-series-part
---
<p class='alert alert-info'>
This is the fourth post in the blog post series called <em>The Three Laws of a Symptom Fix</em>. The series talks about the consequences of fixing a symptom and not the cause of a bug. The overview of the whole series can be found <a href="{% post_url 2015-06-07-the-three-laws-of-a-symptom-fix-the-overview %}">here</a>.
</p>

##The Second Law of a Symptom Fix
> A symptom fix will mutate and spread.

###Spreading
Spreading of a symptom fix is a natural consequence of the fact that the root cause of the bug is not removed. Because of that, the probability is high that the bug will appear in other places that use the buggy code. How often this will happen depends on many factors. The most relevant one is, of course, on how many places the buggy code is called, directly or indirectly.

Spreading simply means introducing new symptom fixes for the same bug in different places in code. As simple as that.

###Mutation
Mutation is a more interesting phenomenon. Once a symptom fix starts spreading, there is no guarantee that all symptom fixes for the same bug will actually look the same. Depending on the nature of the underlying bug, they could come in various forms and could significantly differ from each other.

Let's take [our sample bug]( {% post_url 2015-04-18-the-three-laws-of-a-symptom-fix-the-bug %}) as an example.

The following code crashes:

    someQueryable.Split(3);

and here is its original symptom fix, that we started with:

<pre><code>someQueryable.<strong>ToArray()</strong>.Split(3);</code></pre>

One obvious, very slight mutation of that original symptom fix could be the usage of `ToList()` instead of `ToArray()`:

<pre><code>someQueryable.<strong>ToList()</strong>.Split(3);</code></pre>

Although almost the same, these two symptom fixes still differ from each other. That's why I call them mutations.

In this case, it is easy to guess that both approaches actually try to solve a common problem. But we can easily imagine a more complex symptom fix that mutates significantly from those two. In the case of the the [`Split<T>()`](https://github.com/ironcev/SwissKnife/blob/master/Source/SwissKnife/Collections/CollectionExtensions.cs) extension method, one could come to a conclusion that the `Split<T>()` method itself should be avoided, because it, well, obviously makes problems if called with `someQueryable`.

In that case, the spectrum of possible mutations grows tremendously. Depending on the programmer's skills, personal code writing preferences and many other factors, we could face mutations that could hardly be recognized as correlated with each other.

To illustrate this, let's put the `Split<T>()` method into the context in which it is usually called.

The `Split<T>()` method comes in handy in e.g. rendering elements on a web page, when elements have to be split into rows with fixed number of elements per row.

A typical code for this scenario is very easy to write using the `Split<T>()` method. The following Razor example will render three products per row, whereby the last raw could have less than three products rendered.

    @foreach(var productGroup in products.ToArray().Split(3))
    {
        <div class="row">
            foreach(var product in productGroup)
            {
                <div class="single-product">
                    <!-- Render product -->
                </div>
            }
        </div>
    }

(Note the usage of our original symptom fix in this example - a simple `ToArray()` call injected before the `Split()` is called.)

How the above code could look like if someone comes to the conclusion that `Split<T>()` cannot be used with `products` and decides to write the same rendering code without the `Split<T>()` method?

Below are three out of *many* possible solutions:

    @{
        int rowCounter = 0;
        var productGroup = products.Skip(rowCounter*3).Take(3);
        while (productGroup.Any())
        {
            <div class="row">
            foreach(var product in productGroup)
            {
                <div class="single-product">
                    <!-- Render product -->
                </div>
            }
            </div>
            rowCounter++;
            productGroup = products.Skip(rowCounter*3).Take(3);
        }
    }

&nbsp;

    @{
        var productGroups = products
            .Select((product, index) => new
                {
                    Index = index / groupSize,
                    Product = product
                })
            .GroupBy(x => x.Index);
        foreach(var productGroup in productGroups)
        {
            <div class="row">
                foreach(var element in productGroup)
                {
                    <div class="single-product">
                        <!-- Render element.Product -->
                    </div>
                }
            </div>
        }
    }

&nbsp;

    @{
        var allProducts = products.ToArray();
        if (allProducts.Length > 0)
        {
            <div class="row">
            for(int i = 0; i < allProducts.Length; i++)
            {
                if (i > 0 && i % 3 == 0)
                {
                    </div>
                    <div class="row">
                }
                
                <div class="single-product">
                    <!-- Render allProducts[i] -->
                </div>
            }
            </div>
        }
    }

If the replacement of the `Split<T>()` method with one of those "monster" solutions is not backed by a comment saying that the `Split<T>()` cannot be used with `products`, it would be almost impossible to correlate any of those mutations with our initial simple symptom fix.

##The Consequence
*The Second Law of a Symptom Fix* has its consequence. **Symptom fixes will often remain in code even after the root cause bug is fixed.** Spreading and mutations are obvious reasons for that. The removal of eventual symptom fixes can be done by the person who fixes the root bug or by those who are aware that the root bug is fixed. Depending how widespread the symptom fixes are, it can be that they will be "out of reach" of those who are aware that they can be removed. E.g. if the bug is in a public library, the creators of the library cannot know all the usages of the fixed code. But even if the root bug appears in proprietary code, uncommented mutations like those three shown above make it impossible to detect all of the symptom fixes.

In our concrete example, if someone aware of the bug fix in the `Split<T>()` method tries to remove the introduced symptom fixes, she will easily remove the first two kinds of mutations. This can be done simply by searching for the usage of the `Split<T>()` method. The other three mutations on the other hand can be discovered only through cumbersome and time demanding manual analysis of the code, which often does not pay off.

##To Be Continued...
I hope that the example was illustrative enough. In my next post I'll use the same bug to demonstrate *The Third Law of a Symptom Fix*.