---
title: 'Personalized Marketing, The Microsoft Way'
subtitle: "Reverse engineering the Microsoft's personalized marketing engine."
tags: marketing microsoft nonsense fun
hasCode: false
---
> In the quest to deliver outstanding brand experiences across channels, we believe that **personalisation offers the greatest opportunity to transform what customers currently get**.
<br/>
<br/>
Digital channels in particular allow us to use everything we know about a customer to inform and optimise each interaction.
<br/>
<br/>
Ashley Friedlein @ Econsultancy, [Introducing the Modern Marketing Manifesto](https://econsultancy.com/blog/62574-introducing-the-modern-marketing-manifesto)

##Hello Mr Yakamoto!
Remeber the Gap scene from [Minority Report](https://en.wikipedia.org/wiki/Minority_Report_%28film%29)?

<iframe class="youtube" src="https://www.youtube.com/embed/ITjsb22-EwQ?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>

A short eye scan and in a fraction of a second you know your customer. You know everything about him and most important of all you know exactly what to offer next.

*Hello Mr Yakamoto, welcome back to the Gap. How'd those assorted tank tops work out for you?*

Personalized marketing on its highest level. The Holy Grail of marketing.

##Taking It Seriously
A few years ago [*The Telegraph* reported](http://www.telegraph.co.uk/technology/news/7920057/Minority-Report-style-advertising-billboards-to-target-consumers.html) that IBM tries to make [another one *Minority Report* scene](https://www.youtube.com/watch?v=7bXJ_obaiYQ) a reality.

> Advertising billboards similar to those seen in the film Minority Report, which can recognise passers-by, target them with customised adverts and even use their names, are being developed by computer engineers. 

More recently *TechCrunch* says that [Panasonic partners with Photon](http://techcrunch.com/2014/11/16/panasonic-partners-with-photon/) to bring us the same thing.

And according to the [Photon](http://www.photon.in/)'s CEO, they are not the only ones "making that *Minority Report* vision of personalized messages throughout the store a reality".

> Apple and Google are trying to vie for the future of this omni-channel vision.

When Tesco announced [using facial recognition to better target ads on its gas stations](http://www.bbc.com/news/technology-24803378) some saw it as a "something out of *Minority Report*".

The point is - serious companies take personalized marketing very seriously.

So seriously that they even want to bring it into brick-and-mortar stores. In their online counterparts personalized marketing is anyway already a reality.

A very lucrative reality. A reality in which [some companies cash huge amounts of money daily](https://blog.hubspot.com/blog/tabid/6307/bid/33784/An-Industry-Breakdown-of-Google-s-100-Million-Per-Day-Advertising-Revenue-INFOGRAPHIC.aspx) by serving us well targeted ads, while [some others are successfully catching up](http://www.statista.com/statistics/277229/facebooks-annual-revenue-and-net-income/).

Microsoft tried to catch up as well, but somehow [that didn't work out](http://uk.businessinsider.com/microsoft-advertising-sales-team-redundancies-2014-10?op=1?r=US).

How comes that they failed so miserably to get even a small portion of the market? Speculations are many. In my opinion, their personalized marketing engine - yes that piece of distributed software living somewhere in the forest of Microsoft server farms, chewing tones of data and learning about you, all with a single goal to guess what you could click on next - wasn't written good enough for the demanding task they put in front of it.

I tried to reverse engineer its learning and decision making process, based on the personalized ads I was getting from Microsoft, back then, when they served them daily via Hotmail.

##Reverse Engineering It
> Digital channels in particular allow us to use everything we know about a customer to inform and optimise each interaction. 
<br/>
<br/>
[The Modern Marketing Manifesto](https://econsultancy.com/blog/62574-introducing-the-modern-marketing-manifesto)

*Ah! Here is Igor, logging in into Hotmail. Let me quickly serve some ads! The IP address says Europe. They speak French in Europe, I know that for sure. And have more female than male, that I know as well. This will be an easy one, I see. Let's serve to our Igor a nice French ad with smiling ladies and a pinch of Arabic.*

![Microsoft's Societe Generale ad on Hotmail, in French and with a bit of Arabic script](/resources/personalized-marketing-the-microsoft-way/microsoft-societe-generale-ad-on-hotmail-in-french-and-arabic-script.png)

*Hmmmm, I've been serving this well targeted ad to Igor for more than a week, and no clicks. Strange... Maybe my assumptions were wrong. Maybe Igor is not a female and maybe he doesn't speak French. Let's keep Arabic and go with some male stuff. Football, what else.*

![Microsoft's football ad on Hotmail, in Arabic script](/resources/personalized-marketing-the-microsoft-way/microsoft-football-ad-on-hotmail-in-arabic-script.png)

*Hmmmm. I thought this will be an easy one, but apparently it isn't. A tough nut, this Igor. Maybe he has no interest in football. Can that really be the case? To really test this brave hypothesis, I have to change the advertised product to something really irresistible. Something, something, something like... SkyDrive of course! And Arabic I'll keep. SkyDrive + Arabic, that's a safe bet.*

![Microsoft's SkyDrive ad on Hotmail, in Arabic script](/resources/personalized-marketing-the-microsoft-way/microsoft-sky-drive-ad-on-hotmail-in-arabic-script.png)

*Hmmmm. This is becoming tougher and tougher. No one can resist a service like SkyDrive! No one! Can it be that Igor doesn't understand Arabic script? I doubt. Ok, ok, let's keep SkyDrive (I love SkyDrive. It's my favorite decoy.) and go for some other language. They speak Spanish in Europe as well. Oh, and by the way, SkyDrive has that killer feature of syncing photos between desktop and mobile. Truly irresistible.*

![Microsoft's SkyDrive ad on Hotmail, in Spanish](/resources/personalized-marketing-the-microsoft-way/microsoft-sky-drive-ad-on-hotmail-in-spanish.png)

*Hmmmm. Something is wrong here. People are clicking like crazy on these photo syncing Spanish ads and only Igor doesn't! He is either blind, or... or... or... maaaaybeee he doesn't speak Spanish... Hmmmm. But what he speaks then!? Oh wait! I completely overlooked his name - Igor. Let me crawl my extensive database of human names. Sounds like Russian name. But IP says Europe. Only Belarusian can it be!*

![Microsoft's SkyDrive ad on Hotmail, in Belrusian and Cyrillic script](/resources/personalized-marketing-the-microsoft-way/microsoft-sky-drive-ad-on-hotmail-in-belarusian-and-cyrillic-script.png)

And that was the closest the poor Microsoft's personalized marketing engine ever got - a language from the same family of languages as mine, a script that I, by chance, can read, and a product I have zero interest in. No wonder that they stopped serving ads in Hotmail. I'm sure that that decision didn't affect Microsoft's revenue at all.