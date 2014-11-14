---
title: Location of NuGet Packages
subtitle: 'Changing the default location of NuGet packages explained <a class="senza-parole" href="/tags/senza-parole">without words</a>'
description: This blog post explains without words how to change the default location of NuGet packages by using the NuGet configuration file.
keywords: NuGet package location
tags: senza-parole nuget
---
![NuGet.config file](https://dl.dropboxusercontent.com/u/110510589/location-of-nuget-packages/NuGet_config_file.png)

<pre>
<code>&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;configuration&gt;
  &lt;config&gt;
    &lt;add key="<strong>repositoryPath</strong>" value="Dependencies\Packages" /&gt;
  &lt;/config&gt;
&lt;/configuration&gt;</code></pre>