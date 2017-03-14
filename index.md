---
layout: default
title: Home
subtitle: The Humble Programmer
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