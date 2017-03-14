---
title: His Majesty, Hangul the Filler
subtitle: 'Revealing the secret behind the <a href="/stack-trace-art">Stack Trace Art</a>''s magic.'
tags: stack-trace-art stacktraceangelo unicode
twitter:
  text: 'His Majesty, Hangul the Filler! The story of making the #stacktraceart possible.'
facebook:
  picture: 'stack-trace-art/lulu-i-kak-se-pravi-daga-exception-stack-trace-art.png'
---
![Лулу и как се прави дъга Exception](/resources/stack-trace-art/lulu-i-kak-se-pravi-daga-exception-stack-trace-art.png)

##The Magic
>Any sufficiently advanced technology is indistinguishable from magic.<br/><br/>
Arthur C. Clarke, [Clarke's three laws](http://en.wikipedia.org/wiki/Clarke's_three_laws)

Today I got a [comment on my original post on Stack Trace Art](http://www.thehumbleprogrammer.com/stack-trace-art/#comment-1843595743). The word *magic* occurs twice in it. That word represents so well the common feedback on Stack Trace Art I already got several times. "Wait a second! How did you do it? Do you rewrite the stack trace information somehow? These cannot be real method calls!"

My answer usually produces question marks above the heads of my fellow .NET programmers: "No. This *is* a genuine .NET exception like any other. No tricks of any kind. Stack Trace Art isn't about tricks. It's about throwing a real exception that will create a drawing on the caller's stack trace. A beautiful drawing, please."

[The comment](http://www.thehumbleprogrammer.com/stack-trace-art/#comment-1843595743) motivated me to finally explain how Stack Trace Art works. As you will shortly see there are no tricks or magic in it. As Clark's law says, it's just technology.

That "sufficiently advanced technology" that makes Stack Trace Art appear as magic is a combination of these two facts:

- C# identifiers support broad range of Unicode characters
- In that broad range, there is a very special character called [Hangul Filler](http://www.fileformat.info/info/unicode/char/3164/index.htm). What makes this character so special? Actually, many things. But for our purpose it is mostly the fact that it is at the same time visible to C# compiler and... well... invisible to human eye.

Ladies and gentlemen, prepare to meet His Majesty, Hangul the Filler.

##The Magic Revealed

###C# Identifiers and Unicode
I'm not sure what the majority of C# programmers out there would say if confronted with the following question: "Will the below code compile?"

    public class Cvrči_cvrči_cvrčak_na_čvoru_crne_smrče
    {
        public void कोशिश_करने_वालों_की() { }
        public void Лулу_и_пътуването() { }
        public void De_la_capăt() { }
        public void Herz_schlägt_auch_im_Eis() { }
    }

Well, yes, it will compile. Not only because "Cvrči cvrči cvrčak" is such a well know [tongue twister in my language(s)](http://www.uebersetzung.at/twister/sh.htm). Neither because each of the methods represents a beautiful poem or song.

The reason is much simpler. **C# identifiers are not limited to ASCII characters only.** They support [a vast range of Unicode characters](https://msdn.microsoft.com/en-us/library/aa664670(v=vs.71).aspx).

And here is where my search for *The Invisible Character* began. "If I could only find", I thought, "**a Unicode character that is a valid C# identifier character and at the same time 'invisible' exactly as spaces or tabs are 'invisible'**! That would turn my artist-wannabe-idea into reality! That would allow me to go a step further and write this:"

    public class Cvrčiㅤcvrčiㅤcvrčakㅤnaㅤčvoruㅤcrneㅤsmrče
    {
        public void कोशिशㅤकरनेㅤवालोंㅤकी() { }
        public void Лулуㅤиㅤпътуването() { }
        public void Deㅤlaㅤcapăt() { }
        public void HerzㅤschlägtㅤauchㅤimㅤEis() { }
    }

(Oh, by the way, copy-paste the above code to your C# IDE of choice and compile it. Of course it will compile! No need to ask :-))

<script type="text/javascript">
if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
{
    document.write
    ("<p class='alert alert-danger'>I see that you use Firefox. Unfortunately Firefox does not render <em>The Invisible Character</em> properly. I'll report that to the Firefox team. Meanwhile, if you want to get a feeling how the above code looks like, open this web page in some other browser. I tested the page in Chrome and Internet Explorer and they both render <em>The Invisible Character</em> properly. Basically, the code given above should look like this (I just replaced <em>The Invisible Character</em> with spaces):</p>");
    
    document.write
    ("<pre><code>public class Cvrči cvrči cvrčak na čvoru crne smrče\n" +
     "{\n" +
     "    public void कोशिश करने वालों की() { }\n" +
     "    public void Лулу и пътуването() { }\n" +
     "    public void De la capăt() { }\n" +
     "    public void Herz schlägt auch im Eis() { }\n" +
     "}</code></pre>");
}
</script>

###The Quest for *The Invisible Character*
I crossed my fingers hoping that such character exists and quickly turned the [C# Identifier documentation](https://msdn.microsoft.com/en-us/library/aa664670(v=vs.71).aspx) into the (roughly) following piece of code:

    UnicodeCategory[] validCharacterCategories = 
    {
        UnicodeCategory.UppercaseLetter,
        UnicodeCategory.LowercaseLetter,
        UnicodeCategory.TitlecaseLetter,
        UnicodeCategory.ModifierLetter,
        UnicodeCategory.OtherLetter,
        UnicodeCategory.LetterNumber,
        UnicodeCategory.DecimalDigitNumber,
        UnicodeCategory.ConnectorPunctuation,
        UnicodeCategory.NonSpacingMark,
        UnicodeCategory.Format
    };

    public bool IsValidCSharpIdentifierCharacter(char character)
    {
        return validCharacterCategories
               .Contains(char.GetUnicodeCategory(character));
    }

(You can [see the concrete implementation on GitHub](https://github.com/ironcev/stackTraceangelo/blob/9c58768e14bf4ccaf65aa4b74c8b5ca70b558a18/Source/ProofOfConcept/Core/StackTraceArtGenerator.cs). Be aware of the "Intentionally Bad Code" warning though ;-))

Next, I created a [quick and dirty brute force algoritham](https://github.com/ironcev/stackTraceangelo/tree/9c58768e14bf4ccaf65aa4b74c8b5ca70b558a18/Experiments/PotentialSpaceCharacterReplacements/PotentialSpaceCharacterReplacements) that was supposed to help me catch my *Invisible Character*:

    foreach Unicode character that IsValidCSharpIdentifierCharacter
        draw the character in black color on the white surface
        if the surface afterwards is all white
            yield the character

The algorithm was slow but it did the job. It yielded the following characters:

    char[] theInvisibleCharacters =
    {
        '\u0559', '\u0951', '\u0952', '\u0A51', '\u0A75',
        '\u115F', '\u1160', '\u135F', '\u180B', '\u180C',
        '\u180D', '\u200B', '\u200C', '\u200D', '\u200E',
        '\u200F', '\u202A', '\u202B', '\u202C', '\u202D',
        '\u202E', '\u2060', '\u2061', '\u2062', '\u2063',
        '\u2064', '\u206A', '\u206B', '\u206C', '\u206D',
        '\u206E', '\u206F', '\u2D6F', '\u3164', '\uFE70',
        '\uFE72', '\uFE76', '\uFE78', '\uFE7C', '\uFE7E',
        '\uFEFF', '\uFFA0', '\uFFF9', '\uFFFA', '\uFFFB'
    };

I can't tell you how happy I was! I caught not only one, but several characters that were both 'invisible' and acceptable in C# identifiers!

But my happiness soon started to melt as I tried to compile a piece of C# code using the first character from the list, `'\u0559'`. It didn't work! What?! I tried the second one, `'\u0951'`. It didn't work either!

It was not until I reached the sixth one in the list, **`'\u115F'`**, when C# compiler said: "I'm happy with this one." And so was I.

After scanning the whole list it turned out that only four characters are giving a valid C# code.

And here they are in all their glory. **The four Hangul Filler kings!**

    '\u115F'    Hangul Choseong Filler
    '\u1160'    Hangul Jungseong Filler
    '\u3164'    Hangul Filler
    '\uFFA0'    Halfwidth Hangul Filler

##Putting it All Together
Finding *The Invisible Character* was the necessary precondition for the Stack Trace Art. The next step was to create a prototype of a usable Stack Trace Art editor. Such an editor was supposed to help me in turning my creative ideas into what I called "Unicode art". In "Unicode art", unlike ASCII art, spaces and tabs are forbidden. They are replaced with Hangul Fillers.

Once my ideas are turned into that "Unicode art", the editor should assist me again and generate the code in the targeted programming language - the code that will actually throw a Stack Trace Art exception at runtime.

I've created such editor and called it [stackTraceangelo](https://github.com/ironcev/stackTraceangelo). Although being just a clumsy prototype, I'm proud to say that it is the first usable Stack Trace Art Editor ever created :-)

In one of my upcoming posts I'll explain how *stackTraceangelo* works.

##Contribute!
If you like the Stack Trace Art and believe that it is the best thing in the history of art since van Gogh's [Almond blossom](https://www.google.com/culturalinstitute/asset-viewer/almond-blossom/dAFXSL9sZ1ulDw?projectId=art-project) - than contribue to it! There are a plenty of things that you can do. Add a support for another target language to stackTraceangelo. Contribute to [the gallery](https://github.com/ironcev/stackTraceangelo/tree/master/Source/ArtGallery) by creating your own Stack Trace Art. Or simply [star the project on GitHub](https://github.com/ironcev/stackTraceangelo) to show your support. Thanks!

{% hx_src HisMajestyHangulTheFiller %}