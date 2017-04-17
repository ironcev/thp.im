---
title: Mastering YAGNI
subtitle: "Rare are the moments when I'm really proud of my self-control."
tags: practices yagni
image: "mastering-yagni-you-aint-gonna-need-it-fb.jpg"
publishedOn: "2015-06-12T012:00:00+0100"
lastUpdatedOn: "2017-04-16T12:00:00+0100"
---
> "You aren't gonna need it" (acronym: YAGNI) is a principle of extreme programming (XP) that states a programmer should not add functionality until deemed necessary.<br/>[...] "Always implement things when you actually **need** them, never when you just **foresee** that you need them."
<br/>
<br/>
Wikipedia, [You aren't gonna need it](http://en.wikipedia.org/wiki/You_aren't_gonna_need_it)

##The Need
His email was short and almost grammarless - "hey, need a function for exporting opt-in subscribers Thnx". No addressing, no fullstops, no nothing. Just that one singe line. But still a perfect feature specification.

The implementation was a minute to write. Put an "Export" button on the page. Fetch the emails. Dump them into a file. Done.

##The Foreseen
*The sun was very near the water, sliding off to the north, the boat no more than flotsam: and then I remembered the causeway and the tide.* Newsletter subscribers are just one of many entities in our domain. We have browse pages for all the entities, ([aggregate roots](http://martinfowler.com/bliki/DDD_Aggregate.html) to be more precise), where we display their projections.

*I ran down the island and my heart leaped when I saw the concrete walkway washed by white water, surging up from the right.* **Why not** have the export functionality on all of the browse pages for all the aggregate roots? Why would the subscribers browse page be so special?

*Stuck here, forced to break into the museum or huddle in a corner of the church... but no; the concrete stood clear again.* We should have a **generic solution** here. A **pluggable** export functionality.

*If I ran.* Besides, the **generic solution** is **the right way to do it**. We have to see the feature as a whole and not just one isolated use case.

*I pounded down the steps and ran over the rough concrete.* Also, why exporting to CVS only? I **assume** that most of the users will want to have direct export to Excel files.

*There were scores of parallel sandstone ridges still exposed to the left, but the right side was submerged already, and as I ran a broken wave rolled up onto the walkway and drenched me to the knees, filling my shoes with seawater and scaring me much more than was reasonable.* Actually, for some entities like products, I see PDF or Word document as the best way to export them.

*I ran on cursing.* Having export to Excel **could save us time** for developing some statistics modules in the future. Users **could** do statistics on their own, once they have export to Excel for all entities they care about.

*Onto the rocks and up five steps.* And getting that **generic solution** is fairly trivial.

*At my car I stopped, gasping for breath.* We need a simple `IEntityExporter<T>` interface with just one method, `Export(IEnumerable<T> entities)`.

*I got in the passenger side and took off my boots, socks, and pants.* `T` is the aggregate root projection.

*Put on dry pants, socks, and running shoes.* That way we can define different exporters for the same projection. This will allow **later on** to easily expand the interface with custom settings. By using such settings users could, for example, choose which entity properties to export or how to order them.

*The wind was now a constant gale, ripping over the car and the point and the ocean all around.* `EntityExportManager` would take care of exporter registration.

*It was getting cold, and the wind was a constant kinetic assault.* UI would get the available exporters for the concrete projection type via `EntityExporterProvider`.

*I went back to the car and sat in the passenger seat.* The whole implementation is trivial.

*My notebook lay on the driver's seat.* The registration can be reflection based, thus simplifying it fully for the developers who will write exporters.

*The western horizon was a deep blue, now. Must be eleven at least.* Adding and removing exporters at runtime is than just a step away.

*After a time I lit the candle and set it on the dash.* It would give us **tremendous flexibility**.

##Epilogue
*The car was still rocking in the wind, and the candle flame danced and trembled on its wick.* And then that typical mistake - that saving only to a file on the local disc will be acceptable for our users.

*All the black shadows in the car shivered too, synchronized perfectly with the flame.* Saving directly to Google Drive, Dropbox, OneDrive, or any similar provider is de facto standard nowadays.

*I picked up the notebook and opened it.* Separating the stream generation from its destination is definitely **the right way to do it**.

*Visual Studio appeared in front of me.* When I give it a bit more thought a **flexible pluggable pipeline** would immediately cover all the **possible future requirements**.

*I rested my hands on the keyboard, my fingers in position to write, looking at the keys below my fingers in the quivering shadow of my hand.* *I wrote*

    public ActionResult ExportSubscriberEmails(GetSubscribersQuery query)
    {
        var emails = QueryExecutor
            .Execute(query)
            .Select(subscriber => subscriber.Email);

        return new FileStreamResult
        (
            new MemoryStream
            (
                Encoding.UTF8.GetBytes(string.Join(Environment.NewLine, emails))
            ),
            "application/csv"
        )
        {
            FileDownloadName = string.Format
            (
                "Subscribers exported on {0}.csv",
                TimeGenerator.GetToday().ToString("yyyy.MM.dd")
            )
        };
    }

*Outside it was dark, and the wind howled.*

##Behind The Scenes Featurette
The *storm scenery* comes from the last few paragraphs of [Kim Stanley Robinson](http://en.wikipedia.org/wiki/Kim_Stanley_Robinson)'s novel - ["A History of the Twentieth Century, with Illustrations"](http://www.infinityplus.co.uk/stories/history.htm). It's one of my favorite science fiction novels.

The scenery fits perfectly to the storm I head in my head when I read that short grammarless email. I walked my room for at least twenty minutes sketching that perfect, generic, pluggable whatever exporting system. I lied to myself that I need not more than one hour to implement it. Maybe two. Three at most, testing included.

And the turn at the very end of the novel fits equally perfectly with my turn at the end of those frantic twenty minutes. After loosing precious time in sketching the solution for *The Foreseen* - something that nobody needs or asked for - **I found courage not to implement it**. I sat down and in just a couple of minutes wrote The Only Right Thing to Write. Same as the novel's hero at the end of the novel.

I won over myself.

##Deleted Scenes From The Cutting Room Floor
[Martin Fowler](http://martinfowler.com/aboutMe.html) wrote a [good article on YAGNI](http://martinfowler.com/bliki/Yagni.html).

[You Arent Gonna Need It](http://c2.com/cgi/wiki?YouArentGonnaNeedIt) on [c2.com](http://c2.com) is a perfect place to get some more information and views, as well as links to numerous related topics.

But after all, that's all theory :-) Mastering YAGNI is, at least for me, a constant exercise in self-control. It is not easy at all to say "No!" to all those cool features that one *might* need one day.