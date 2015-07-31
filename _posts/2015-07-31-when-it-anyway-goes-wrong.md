---
title: Wђen ǁt Anƴwaƴ Ǧoes Ɯrong
subtitle: A strong impression that ƃugs are inevitaƃle
description: This blog post reflects a strong impression that I had when an unexplainable bug appeared in Windows security prompt - bugs are inevitable.
keywords: 
tags: impression bug
---
##"No Way!" You Will Say
> If anything simply cannot go wrong, it will anyway.
<br/>
<br/>
Murphy's law (actually, one of its [many variations](http://www.murphys-laws.com/murphy/murphy-laws.html))

Sometimes things simply cannot go wrong. Or they shouldn't go wrong. Or there is no possible reason why they would go wrong.

Let's take the good old Windows security prompt, for example. It's well known to all of us. It pops up every now and then. It's not a novelty in Windows. On the contrary, it has been around for ages. It has never made any troubles (except, well, being known as annoying). We can assume with good certainty that it's very well tested. After all, it's nothing more than a simple Windows dialogue.

And now imagine that one day instead of your "*DOMAIN\Username*"

![Windows security prompt](/resources/when-it-anyway-goes-wrong/windows-security-prompt.jpg)

the prompt suddenly displays "*ƆѺƜAIN\Ξsername*".

![Windows security prompt with bug](/resources/when-it-anyway-goes-wrong/windows-security-prompt-with-bug.jpg)

"No way!" you will say. "No way!" I would say as well. But yet, it happened. A few days ago the good, old, well tested, well known, and fairly simple Windows security prompt suddenly decided to replace two everyday ASCII characters with some random pickups out of the wild Unicode set, namely with `¶` and `ᅥ`.

<p>
Here is how it looked like, with a bit of <span style="color:red">red</span> added from my side for your convenience and a bit of fragment blur to protect sensitive data.
</p>

![A bug in the Windows security prompt](/resources/when-it-anyway-goes-wrong/a-bug-in-the-windows-security-prompt.png)

##The Impression
Somewhere something happened. Somewhere on their way from Active Directory to the surface of my screen two simple ASCII characters have been turned into `¶` and `ᅥ`. Apparently without any particular or better to say *any possible* reason.

My colleagues tried to guess how that trap, into which the poor ASCII fellows have been fallen, could look like. Non of the hypothesis they gave sounded convincing to me.

That unexplainable and impossible bug left behind a strong, half-a-day-lasting impression in my mind.

It is sometimes almost scary when you think how many things can go wrong in software. Even when there is nothing that could go wrong.

It is almost scary when you think that despite our best programming practices, deep care of the code we write and meticulous testing, there are still constellations and circumstances under which that precious output of our coding will suddenly start to behave strange. Apparently, without any reason to do so.

It seams like **bugs are inevitable in complex systems**. No matter how careful we are, there will always be a constellation of software and hardware components on our machines that will, at certain point, cause that "ǁnevitaƃle Ɓug".

##Granny's Old Fashioned "ǁnevitaƃle Ɓug" Recipe
So, you want to taste that single most common dessert at programmer's table - the delicious "ǁnevitaƃle Ɓug"? 

There are numerous recipes out there, all tasting better than the other. Here is an old fashioned one. A granny's recipe that sometimes produces an "ǁnevitaƃle Ɓug" of the richest flavor.

Start with upgrading your graphic card driver to its latest version. Leave it updated about an hour to an hour and a half. While the graphic card driver is still cooling, say "Yes" when Skype asks you to "improve your user experience". Mix in the latest security upgrades of your operating system. If you want the ƃug to be extra smooth, uninstall some random software from you machine that you do not use anyway.

About half-way through the baking, you may want to fill those empty slots on your motherboard with additional 8 GB of RAM from some cheep RAM manufacturer.

Serve with whipped cream and wait. The ǁnevitaƃle Ɓug will pop up sooner or later in any form imaginable. Perhaps, who knows, your *username* will appear in the Windows security prompt as *¶userᅥname*.

Don't worry. Everything will work fine after you restart your computer.

Scary, when you think of it.

As [Donlad Knuth](https://en.wikipedia.org/wiki/Donald_Knuth) once said

> Software is hard.

It is hard, indeed.

##Afterthought
In the middle of writing the above lines, I witnessed a nicely growing startup moving from a simple deployment architecture:

![A simple deployment architecture](/resources/when-it-anyway-goes-wrong/simple-deployment-architecture.png)

to a fairly complex one:

![A complex deployment architecture](/resources/when-it-anyway-goes-wrong/complex-deployment-architecture.png)

Everything seamed to work fine. Website was stable, working as expected. Production tests were passing. Champagne bottles were already in the air, ready to be shaken. And than someone noticed that a small piece of Flash was not downloading properly to client machines.

The number of nodes increased and so did the number of points at which the ǁnevitaƃle Ɓug got its chance to step in and kick out the unlucky SWF file.

Software is hard, indeed.