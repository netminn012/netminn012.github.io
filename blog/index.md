---
layout: default
title: ブログ
---

<section class="mb-5" data-aos="fade-up">
    <h2 class="h3 mb-4">最新記事</h2>
    <div class="row">
        {% for post in site.posts %}
        <div class="col-md-6 mb-4" data-aos="zoom-in" data-aos-delay="{{ forloop.index | times: 100 }}">
            <div class="card bg-secondary text-light h-100">
                <div class="card-body">
                    <h5 class="card-title">{{ post.title }}</h5>
                    <p class="card-text text-muted">{{ post.date | date: "%Y年%m月%d日" }}</p>
                    <p class="card-text">{{ post.excerpt | strip_html | truncate: 100 }}</p>
                    <a href="{{ post.url | relative_url }}" class="btn btn-primary">続きを読む</a>
                </div>
            </div>
        </div>
        {% endfor %}
    </div>
</section>