---
layout: default
title: Tags
description: Tags used in The Humble Programmer blog posts. Each tag links to the posts marked with that tag.
---
<div class="tags-list">
    {% capture allTags %}
        {% for postsByTag in site.tags %}
            {% assign tag = postsByTag | first %}
            {{ tag | append: ' ' }}
        {% endfor %}
    {% endcapture %}
    {% assign allTags = allTags | strip | split:' ' | sort %}
    <ul>
    {% for tag in allTags %}
        {% unless tag contains '-series-part' %}
            <li class="{{ tag }}"><a href="{{ tag | prepend:'/tags/' }}">{{ tag }}</a></li>
        {% endunless %}
    {% endfor %}
    </ul>
</div>