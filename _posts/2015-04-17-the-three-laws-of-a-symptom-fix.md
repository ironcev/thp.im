---
title: The Three Laws of a Symptom Fix
subtitle: Three inevitable consequences of fixing a symptom and not the cause of a bug
description: This blog post presents three inevitable consequences of fixing a symptom and not the cause of a bug.
keywords: 
tags: bug symptom-fix symptom-fix-series-part blog-post-series
---
<p class='alert alert-info'>
This is the first post in the blog post series called <em>The Three Laws of a Symptom Fix</em>. The series talks about the consequences of fixing a symptom and not the cause of a bug. The overview of the whole series can be found <a href="{% post_url 2015-06-07-the-three-laws-of-a-symptom-fix-the-overview %}">here</a>.
</p>

##The Temptation

<blockquote>
<p>[...] He promptly loaded the function into an editor and said, "Oh, that function can't take a NULL pointer." Then, as I stood there watching, he fixed the bug by inserting a "quick escape" if the pointer was NULL:
</p>
<pre>if (pb == NULL)
    return (FALSE);
</pre>
<p>I pointed out that if the function shouldn't be getting a NULL pointer, the bug was in the caller, not in the function, to which he replied, "I know the code; this will fix it." And it did. But to me the solution felt as if <strong>we'd fixed a symptom of the bug and not the cause of it</strong> [...]
<br/><br/>
Steve Maguire, <a href="http://www.amazon.com/Writing-Solid-Code-Microsoft-Programming/dp/1556155514">Writing Solid Code</a>, p. 176
</p>
</blockquote>

A temptation to quick-fix a bug can sometimes be really hard to resist. Especially when a good and reliable bug fix is just five keystrokes away and the pressure to deliver new product features is extremely high. Try to put yourself in the following situation. This code:

    someQueryable.Split(3);

crashes with a nasty exception saying that "*There is already an open DataReader associated with this Command which must be closed first.*", while this code:

    someQueryable.ToArray().Split(3);

works perfectly fine and you know that it will always work fine.

The difference between the two lines, with a little help of IntelliSense of course, is in exactly five keystrokes. Dot, "t", "o", "a", enter - and voilà! Exception is gone forever! Let's get back to real work. We have features to deliver!

##The Three Laws

In this concrete case, I was both the programmer from the Steve's quote and the Steve himself, embodied in a single person. I knew the code and I knew that `ToArray()` will fix it. But I also "*felt as if we'd fixed a symptom of the bug and not the cause of it*".

Not spending time to dig deep enough and find the real cause of a bug has its price. Accepting a five-stroke bug fix and moving on usually ends up in exchanging a short-term gain - bug is fixed, let's move on with the features - with a long-term pain. That long term pain caused by a symptom fix usually comes later on in a form of what I call **The Three Laws of a Symptom Fix**.

I formulated the laws based solely on my experience with symptom fixes. Over a course of a decade and a half I testified the truth behind the laws on countless examples of a symptom fix. I'm sure most of you out there experienced the same. No mater how good a symptom fix is, the fact that the cause is not fixed will always result in at least one of the laws coming into force, if not all of them.

And so here they are, The Three Laws of a Symptom Fix:

- **A symptom fix will be unintentionally removed and the bug will reappear.**
- **A symptom fix will mutate and spread.**
- **The one-to-rule-them-all symptom fix will appear, being more dangerous than any of the individual symptom fixes.**

Let's explain *The Three Laws* shortly.

###The First Law: A symptom fix will be unintentionally removed and the bug will reappear

Symptom fixes look alienated in the code. In one way or another, they always somehow stick out. They do not belong to the solution of the original problem that the code tries to solve. They are an artificial addition, put to the code to circumvent the situation that causes buggy behaviour. Out of my experience, they are too often not properly commented at all. No wonder that this is the case. The "proper" comment would sound like: "Don't remove this or everything will crash!" This kind of a comment would imply that the fix is actually a symptom fix, but the person who apply it usually do not consider it as such, and therefore omits the warning comment.

Sooner or later some other programmer will start changing the same code and ask the obvious question "Why is this line of code here? It doesn't look that we need it." I was that other programmer several times. Once the fix is unintentionally removed it's merely a matter of luck how fast the bug will reappear again. If you are lucky, your automated tests will fail or your application will crash immediately. If you are not, the users of your software will get the honour to tell you that, well... your best intentions to clean-up the code have actually removed a symptom fix and reintroduced the bug.

###The Second Law: A symptom fix will mutate and spread

Since the symptom is fixed and not the cause, the probability is high that the bug will appear in other places that use the buggy code. This often results in other programmers writing fixes for the same bug all over again. Let me quote Steve again:

> Other times, I've tracked a bug to it source and then thought, "Wait, this can't be right; if it is, this function over here would be broken too, and it's not." I'm sure you can guess why this other function worked. It worked because somebody had used a local fix for a more general bug.
<br/><br/>
Steve Maguire, <a href="http://www.amazon.com/Writing-Solid-Code-Microsoft-Programming/dp/1556155514">Writing Solid Code</a>, p. 176

Writing symptom fixes for the common bug all over again is what I call *spreading a symptom fix*. Those spread fixes will of course not always look the same. Depending on the nature of the underlying bug, they could come in various forms and could significantly differ from each other. That's why I call them *mutations of a symptom fix*.

###The Third Law: The one-to-rule-them-all symptom fix will appear, being more dangerous than any of the individual symptom fixes

Ah, if I would get a penny for every global try-catch I saw, that tried to swallow "that situation that shouldn't happened"... I'm sure you know what I'm talking about.

A one-to-rule-them-all symptom fix is an antipode of the root-cause fix. What makes it dangerous is the fact that it has the same end-effect as the root-cause fix. It makes all appearances of the bug to disappear. The difference is that the root-cause fix fixes the problem, and the one-to-rule-them-all symptom fix efficiently hides it. This hiding could lead to more problems.  Also, depending on the approach used in implementing the one-to-rule-them-all, its unintentional removal could lead to a disaster.

##Examples, please!

I hope this theoretical overview of *The Three Laws* makes sense to you. Still, there is nothing like a good concrete example :-) It happened by chance that my five-stroke symptom fix of the [`Split<T>()`](https://github.com/ironcev/SwissKnife/blob/master/Source/SwissKnife/Collections/CollectionExtensions.cs) extension method can serve as a perfect example to demonstrate all three laws.

My [next post]({% post_url 2015-04-18-the-three-laws-of-a-symptom-fix-the-bug %}) shortly explains the bug in the `Split<T>()` method and its symptom fix.

I use this symptom fix afterwards in three separate posts to demonstrate each of the laws in detail:

- [The Three Laws of a Symptom Fix - Removal and Reappearance]({% post_url 2015-04-23-the-three-laws-of-a-symptom-fix-removal-and-reappearance %})
- [The Three Laws of a Symptom Fix - Mutation and Spreading]({% post_url 2015-06-07-the-three-laws-of-a-symptom-fix-mutation-and-spreading %})
- The Three Laws of a Symptom Fix - One to Rule Them All (still to be written)

All together these posts form a blog series on the topic of symptom fixes and their consequences. I hope that this series will motivate you to always dig as deep as needed to find the cause of a bug before eventually fixing any of its symptoms.