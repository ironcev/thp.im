---
title: Stack Trace Art
subtitle: An artist wannabe discovers his own art - turning programming exceptions into beautiful drawings.
tags: stack-trace-art stacktraceangelo fun
image: "stack-trace-art-fb.png"
publishedOn: "2013-05-31T12:00:00+01:00"
lastUpdatedOn: "2018-06-20T12:00:00+01:00"
disqusIdentifier: "Stack Trace Art | The Humble Programmer"
---
## In Its Essence
Stack Trace Art is, in its essence, the art of throwing an exception that creates a beautiful drawing on the caller's stack trace. Before you dive deeper into its origins and the question of its purpose, enjoy first some of the exceptions being thrown and their drawings being drawn.

![Лулу и как се прави дъга Exception](/resources/stack-trace-art/lulu-i-kak-se-pravi-daga-exception-stack-trace-art.png)

![Crossed Fingers Exception](/resources/stack-trace-art/crossed-fingers-exception-stack-trace-art.png)

![Nested Om Exception](/resources/stack-trace-art/nested-om-exception-stack-trace-art.png)

![The Burning Heart of Desire Exception](/resources/stack-trace-art/the-burning-heart-of-desire-exception-stack-trace-art.png)

![The Cat in the Sac Exception](/resources/stack-trace-art/the-cat-in-the-sac-exception-stack-trace-art.png)

## Pozdrav
"Pozdrav" is Croatian word for "Greeting". Nowadays it's widely used as a greeting itself. You can hear people on the street saying "Pozdrav!" to each other. It's quite often to start your email with "Pozdrav!". Strange, isn't it? You usually don't greet people with "Greeting!". You will say "Hi!" or "Hello!" or maybe even "Greeting**s**!", but not "Greeting!".

I like to believe that I was the first person in Croatia who started using "Pozdrav" as an informal salutation.

It was back in 1997 or 1998; I'm sure, or at least I'm assuming that I'm sure, of the fact that I didn't hear it from anyone else. I started using it because I found it somewhat cool. It wasn't easy to use it. It did sound strange in the beginning. Some people simply couldn't stand it. On the other hand, likewise some of my friends also found it cool. No matter what other people thought, I liked it and I kept using it.

## Being the First
Imagine being the first person in the world to have started or stumbled upon something. It can be something as trivial as using the word "Greeting!" as a greeting. On the other hand it can as well be a scientific theory that may change the way we see the world. It doesn't matter what it is or what it could be. Just the idea of being the first, to me, is appealing enough on its own.

Ironically I don't believe in something like "being the first". Whatever brand new idea you are thinking about right now; somewhere else someone has already thought of it. Now there is surely someone somewhere on earth who has already thought of it, or is thinking about it, or will think of it in the very near future. For each [Issac Newton](https://en.wikipedia.org/wiki/Isaac_Newton) there is somewhere his [Gottfried Leibniz](https://en.wikipedia.org/wiki/Gottfried_Leibniz) (and vice versa) working on the same idea at the same time. For each [János Bolyai](https://en.wikipedia.org/wiki/János_Bolyai) there is his [Lobachevsky](https://en.wikipedia.org/wiki/Nikolai_Ivanovich_Lobachevsky) proving that "[discoveries, like springtime violets in the woods, have their season which no human can hasten or retard](http://www-groups.dcs.st-andrews.ac.uk/~history/Quotations/Bolyai.html)".

There was someone in Croatia back in 90' who might have used "Pozdrav" as a greeting before I did. I even probably heard it from that very someone, but forgot that it happened that way. That's what the logic tells me. I still can't stand the appeal of "being the first" and yet in my head I'm still the very first person who started using "Pozdrav" as a greeting.

And here it comes again. The same appeal. Although I know that there is most probably someone somewhere who already did it, and yet again I believe that I'm the first one who came to the idea to draw a piece of art on an exception stack trace.

## Stack Trace Art – The Beginning
Friday was it, 12th of April 2013. A colleague was struggling with some legacy web services. "Everything I get over the wire using SOAP exception is the stack trace! I can't transfer any meaningful information." he complained. "Well then, just embed some meaningful JSON into the stack trace and parse the trace on the client side.", I told him. We both laughed. Writing a class with methods whose call stack looks like a JSON document would have been a crown of all the workarounds we had done so far in our professional careers.

Suddenly from a mere joke, this whole stack trace thing turned into a vision in my head; a voilà; a new art form was born. Drawings made from method calls. Having an exception in the stack trace that would look like a piece of art. My dear colleague laughed when I told him about the vision. He thought that I was kidding once again. Apparently, I wasn't.

Next day afternoon [stackTraceangelo](https://github.com/ironcev/stack-trace-art), the first Stack Trace Art editor known to me, was born.
Using it I quickly turned [this ASCII art](http://asciiworld.com/-Cats-.html):
<pre>
              a          a
             aaa        aaa
            aaaaaaaaaaaaaaaa
           aaaaaaaaaaaaaaaaaa
          aaaaafaaaaaaafaaaaaa
          aaaaaaaaaaaaaaaaaaaa
           aaaaaaaaaaaaaaaaaa
            aaaaaaa  aaaaaaa
             aaaaaaaaaaaaaa
  a         aaaaaaaaaaaaaaaa
 aaa       aaaaaaaaaaaaaaaaaa
 aaa      aaaaaaaaaaaaaaaaaaaa
 aaa     aaaaaaaaaaaaaaaaaaaaaa
 aaa    aaaaaaaaaaaaaaaaaaaaaaaa
  aaa   aaaaaaaaaaaaaaaaaaaaaaaa
  aaa   aaaaaaaaaaaaaaaaaaaaaaaa
  aaa    aaaaaaaaaaaaaaaaaaaaaa
   aaa    aaaaaaaaaaaaaaaaaaaa
    aaaaaaaaaaaaaaaaaaaaaaaaaa
     aaaaaaaaaaaaaaaaaaaaaaaaa
</pre>
into the [cat in the sac](http://www.youtube.com/watch?v=tPAJomPCdZs) exception that leaves the following stack trace:

![The Cat in the Sac Exception](/resources/stack-trace-art/the-cat-in-the-sac-exception-stack-trace-art.png)

Just a few minutes before our Scrum review meeting I intentionally injected the unhandled exception into the code of the application that my team was working on. The application crashed miserably of course. Surprised by the crash, my colleagues immediately opened the log file, but just to experience an even bigger surprise. Smiling cat is the last thing a .NET developer would expect to see in the stack trace.

That happened on the 17th of April 2013. I consider that date to be the date of the first public exhibition of a piece of art in the stack trace: The Stack Trace Art; as I called it.

## L'art pour l'art
The second public exhibition happened with my other team which was geographically dislocated from the first one. The Scrum review meeting that we had a few weeks later, on 2nd of May 2013, was a perfect opportunity to present the cat in the sac together with a few more pieces of the Stack Trace Art.

The audience made of pragmatic developers immediately brought out a philosophical question: "What's the purpose of it? What can we do with it?"

My answer was simple: "Stack Trace Art has no purpose." It is an art. There is no utilitarian function in it. It's an [art for art's sake](https://en.wikipedia.org/wiki/Art_for_art's_sake).

Still, I don't insist on keeping it fully purposeless. You can use it, for example, to break a potentially boring programmer's daily routine. Trust me; it could be some of your colleagues might believe that Space Invaders did attack their program, with no persuasions required:

![Space Invaders Exception](/resources/stack-trace-art/space-invaders-exception-stack-trace-art.png)

Like every other art, the Stack Trace Art can be used to convey feelings. Injecting the burning heart of desire into the code of the girl you like is a good way to show what you feel about her:

![The Burning Heart of Desire Exception](/resources/stack-trace-art/the-burning-heart-of-desire-exception-stack-trace-art.png)

The Stack Trace Art can be used to convey opinions and preferences. What stops you from sharing one of your favorite Bulgarian poems with your team members:

![Lulu i patuvaneto](/resources/stack-trace-art/lulu-i-patuvaneto-exception-stack-trace-art.png)

In plain and simple words, Stack Trace Art is all about expressing and communicating yourself to other programmers in a very unique way, which only another programmer can understand.

## Rekindling Your Artistic Soul
A freelance programmer, whom I once met wanted to get the legal status of a free artist. "Well, what qualifies you as artist?" I asked. "All programmers are actually artists." he replied. "No one understands what we are doing and yet we are all underpaid for it. This surely qualifies us as artists." If you feel the same, then don't be afraid for what you really are, an artist. Rekindle your artistic soul! Download [stackTraceangelo](https://github.com/ironcev/stack-trace-art) and create some cool pieces of Stack Trace Art! Inject it into other programmer's code!

After you do so, please don't forget to share your Stack Trace Art with the rest of the world or at least with me. I'll be so happy to see it!

But what if you belong to that rare minority of programmers who are both understood and well paid? According to the above definition (questionable I must say), then you do not qualify as an artist. But still, do not despair; [stackTraceangelo](https://github.com/ironcev/stack-trace-art) comes with its own [art gallery](https://github.com/ironcev/stack-trace-art/tree/master/Source/ArtGallery). Just reference the gallery in your project and surprise your colleagues with a nice piece of the finest Stack Trace Art.

## There Are Real Artists Though
Although often misunderstood, I can't say that I'm underpaid which makes me (still) only an artist wannabe. All jokes aside, I don't have the right skills necessary to create from scratch the art depicted above. The cat, space invader, heart and the poem are adaptations of the work of real artists, which were created for entirely different purpose. My adaptations are done having [fair use](http://www.ascii-art.de/info/copyright/#fair) in mind.

My deepest admiration goes to:

- the unknown author of the [cat that served as the base for the cat in the sac](http://asciiworld.com/-Cats-.html)
- Ulrich Schreglmann a.k.a. ool for his [Red Baron series from which I took the Space Invader](http://www.ascii-art.de/ascii/s/space_invaders.txt)
- Dirk Lucas a.k.a. AoS (Ace of Spades) for his [burning heart](http://www.ascii-art.de/ascii/ghi/heart.txt)
- Petya Kokudeva for her beautiful book [Lulu](http://www.dailymotion.com/pkokudeva#video=xm47k7) from which I took the poem "Лулу и пътуването"

## Finding My Lobachevsky
Somewhere in this world there must be that girl/guy who invented the Stack Trace Art before I did. I did search all over Internet to find if my idea is still mine but my search ended in vain.

If you know that person, please give me her/his details. I want to congratulate her/him for proving again that every Newton has his Leibniz and every Bolyai has his Lobachevsky. And thus giving credit where credit is due. May The Stack Trace Art be with you, I wish you all the best of luck.