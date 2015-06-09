---
layout: default
title: Home
description: The Humble Programmer
keywords: The Humble Programmer .NET C# F# Jekyll CSS NuGet
---
<div class="contentList">
    <ul>
    {% for post in site.posts %}
        {% unless post.tags contains 'senza-parole' %}
            <li class="{% for tag in post.tags %}{{ tag | prepend:' ' }}{% endfor %}"><a href="{{ post.url }}">{{ post.title }}</a></li>
        {% endunless %}
    {% endfor %}
    </ul>
</div>