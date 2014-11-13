---
title: Is a Class Static
subtitle: 'How to determine (<a class="senza-parole" href="/tags/senza-parole">without words</a>) if a class is <code>static</code>'
description: This blog post explains without words how to determine via reflection if a .NET class is static. Plain and simple.
keywords: static class
tags: senza-parole reflection csharp
---
<pre><code>type.IsAbstract && type.IsSealed</code></pre>

<pre><code>using <a href="http://github.com/ironcev/swissknife">SwissKnife</a>;
...
type.IsStatic();</code></pre>