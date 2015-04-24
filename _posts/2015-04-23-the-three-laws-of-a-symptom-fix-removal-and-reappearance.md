---
title: The Three Laws of a Symptom Fix - Removal and Reappearance
subtitle: 'The <a href="/the-three-laws-of-a-symptom-fix#the-first-law-a-symptom-fix-will-be-unintentionally-removed-and-the-bug-will-reappear">First Law of a Symptom Fix</a>, illustrated on a concrete example'
description: This blog post illustrates The First Law of a Symptom Fix on a concrete example.
keywords: symptom fix
tags: bugs
---
##The Three Laws of a Symptom Fix?
*The Three Laws of a Symptom Fix* represent three inevitable consequences of fixing a symptom and not the cause of a bug. I formulated them based on my own experience with symptom fixes. I believe though, that any programmer who ever witnessed a symptom fix (and who of us didn't!) shares the very same experience.

My [post on The Three Laws of a Symptom Fix]({% post_url 2015-04-17-the-three-laws-of-a-symptom-fix %}) shortly [explains each of the laws]({% post_url 2015-04-17-the-three-laws-of-a-symptom-fix %}#the-three-laws). The post also presents a concrete case of a symptom fix that motivated me to write more about *The Three Laws*.

In [my last post]({% post_url 2015-04-18-the-three-laws-of-a-symptom-fix-the-bug %}) I discussed that case – a bug in the [`Split<T>()`](https://github.com/ironcev/SwissKnife/blob/master/Source/SwissKnife/Collections/CollectionExtensions.cs) extension method. I find this bug to be a perfect example for demonstrating *The Thee Laws*. So I decided to use it in three additional blog posts for the demonstration purpose. Each of the posts will give a concrete example of one of *The Laws* coming into force.

In this post, I will use [the bug in the `Split<T>()` extension method]({% post_url 2015-04-18-the-three-laws-of-a-symptom-fix-the-bug %}) to illustrate *The First Law of a Symptom Fix*

Note that **The Thee Laws are universal**. They do not depend on the nature of a particular bug. They are also programming-language and platform agnostic.

The three posts just attempt to illustrate them on tangible examples. The examples could be seen as simplified, but still I believe that they show pretty well the essence of each of *The Laws*.

##The First Law of a Symptom Fix
> A symptom fix will be unintentionally removed and the bug will reappear.

So, why would anyone remove a symptom fix from the code? What is so different about symptom fixes that makes them good candidates for removal from the code?

Let me quote [what I already wrote]({% post_url 2015-04-17-the-three-laws-of-a-symptom-fix %}#the-first-law-a-symptom-fix-will-be-unintentionally-removed-and-the-bug-will-reappear):

> Symptom fixes look alienated in the code. In one way or another, they always somehow stick out. They do not belong to the solution of the original problem that the code tries to solve. They are an artificial addition, put to the code to circumvent the situation that causes buggy behaviour.

To illustrate it, I'll use the piece of code that motivated me to write this blog post series. Besides the argument checks removed for brevity, and the class properties slightly changed to make it easier to follow the example without knowing the business domain, the code is in its essence same as the original one.

So, this is the code that caused one of its clients to crash:

    public BannersViewModel(IEnumerable<Banner> banners,
                            IEnumerable<BannerCategory> bannerCategories,
                            IEnumerable<SomeBusinessEntity> someBusinessEntities)
    {
        Banners = banners;
        BannerCategories = bannerCategories;
        SomeBusinessEntities = someBusinessEntities;
    }

And this is the version with the symptom fix.

<pre>
<code>public BannersViewModel(IEnumerable&lt;Banner&gt; banners,
                        IEnumerable&lt;BannerCategory&gt; bannerCategories,
                        IEnumerable&lt;SomeBusinessEntity&gt; someBusinessEntities)
{
    Banners = banners;
    BannerCategories = bannerCategories<strong>.ToArray()</strong>;
    SomeBusinessEntities = someBusinessEntities;
}</code>
</pre>

##Sticking Out
Note how the `ToArray()` call sticks out from the rest of the code. In this case it sticks out so much that one could actually say: "Hmm, this has to be here with a good reason. Let me better leave it as it is." One could even try to dig deeper to see who put it inside and why.

But out of my experience, the code that has that appeal of "being in wrong place" without a real need, more often simply get removed by a programmer who stumble upon it. "Why is this `ToArray()` call here only on the second property? It must be that someone forgot to remove it." This is a kind of a reaction I witnessed more often than the previous one.

To put it simple, there is a good probability that someone will once remove the symptom fix, in this case, the `ToArray()` call.

##The Reappearance
What happens afterwards, once when the symptom fix has been unintentionally removed? That depends on many factors. To [quote myself again]({% post_url 2015-04-17-the-three-laws-of-a-symptom-fix %}#the-first-law-a-symptom-fix-will-be-unintentionally-removed-and-the-bug-will-reappear):

> If you are lucky, your automated tests will fail or your application will crash immediately. If you are not, the users of your software will get the honour to tell you that, well... your best intentions to clean-up the code have actually removed a symptom fix and reintroduced the bug.

In this particular case, the `BannersViewModel`s are used from several views and only one of them calls the `Split<T>()` method on the `BannerCategories` property. Still, the symptom fix was not introduced on the level of the view itself but within the view model. There is no visible connection between the fix in the view model and the crash in one of the views.

If the programmer who "fixed" the original crash didn't add a check that ensures that `BannerCategories` are "`Split<T>()`-friendly" the unit tests for the `BannersViewModel` class would remain green after the removal of the `ToArray()` call.

If the UI itself is not covered with automated tests and the problematic usage appears somewhere out of the main application use cases or even worse appears only when certain conditions are met - the reintroduced could easily remain unnoticed by programmers and testers.

##To Be Continued...
I hope that the example, although simplified, was illustrative enough. In my next post I'll use the same bug to demonstrate *The Second Law of a Symptom Fix*.