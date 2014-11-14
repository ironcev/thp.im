---
title: HTML Inside of a Tipsy Tooltip
subtitle: 'Displaying an arbitrary HTML inside of a <a href="http://onehackoranother.com/projects/jquery/tipsy/">Tipsy tooltip</a> explained <a class="senza-parole" href="/tags/senza-parole">without words</a>'
description: This blog post explains without words how to display an arbitrary piece of HTML inside of a jQuery Tipsy tooltip.
keywords: Tipsy tooltip
tags: senza-parole tipsy
---
<pre>
<code>
&lt;div id="<strong>tooltip</strong>" style="display: none"&gt;
  &lt;!-- Here comes the HTML content. E.g.: --&gt;
  &lt;h1&gt;Title&lt;/h1&gt;
  &lt;h2&gt;Sub Title&lt;/h2&gt;
  &lt;p&gt;Paragraph&lt;/p&gt;
&lt;/div&gt;

$('a').tipsy({
            <strong>html: true</strong>,
            <strong>title: function</strong> () {
                return $('<strong>#tooltip</strong>').html();
            }
        });
</code>
</pre>