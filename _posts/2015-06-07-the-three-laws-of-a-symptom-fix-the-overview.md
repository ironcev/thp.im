---
title: The Three Laws of a Symptom Fix - The Overview
subtitle: "A short overview of The Three Laws of a Symptom Fix blog post series."
tags: bug symptom-fix symptom-fix-series-part
hasCode: false
image: "https://thp.im/resources/the-three-laws-of-a-symptom-fix/the-three-laws-of-a-symptom-fix-fb.jpg"
publishedOn: "2015-06-07T12:00:00+01:00"
lastUpdatedOn: "2017-04-16T12:00:00+01:00"
---
**The Three Laws of a Symptom Fix represent three inevitable consequences of fixing a symptom and not the cause of a bug.** I formulated them based on my own experience with numerous symptom fixes that I either wrote myself or witnessed. I'm sure though, that any programmer who ever wrote or witnessed a symptom fix (and who of us didn't!) shares the very same experience.

Since there was a lot to say on the subject I decided to write a blog post series about it. Here is a short overview of it:

- ["The Three Laws of a Symptom Fix"]({% post_url 2015-04-17-the-three-laws-of-a-symptom-fix %}) post shortly explains each of the laws. It also presents a concrete case of a symptom fix that motivated me to write more about *The Three Laws*.

- In ["The Bug"]({% post_url 2015-04-18-the-three-laws-of-a-symptom-fix-the-bug %}) post I discuss that concrete case – a bug in the [`Split<T>()`](https://github.com/ironcev/SwissKnife/blob/master/Source/SwissKnife/Collections/CollectionExtensions.cs) extension method. I saw this bug as a perfect example for demonstrating *The Thee Laws*. So I decided to use it in three additional blog posts for the demonstration purpose.

- In the ["Removal and Reappearance"]({% post_url 2015-04-23-the-three-laws-of-a-symptom-fix-removal-and-reappearance %}) post, I use the mentioned bug in the `Split<T>()` extension method to illustrate *The First Law of a Symptom Fix*.

- The ["Mutation and Spreading"]({% post_url 2015-06-07-the-three-laws-of-a-symptom-fix-mutation-and-spreading %}) post uses the same bug to illustrate the *The Second Law of a Symptom Fix*.

- The "One to Rule Them All" post (still to be written) uses it to illustrate the *The Third Law of a Symptom Fix*.

Note that **The Thee Laws are universal**. They do not depend on nature of a particular bug. They are also programming-language and platform agnostic.

The three posts attempt to illustrate them on tangible examples. The examples could be seen as simplified, but still I believe they demonstrate pretty well the essence of each of *The Laws*.