{% if item.example %}
  <h3 class="item__sub-heading">Example</h3>

  {% for example in item.example %}
  <div class="item__example  example">
    {% if example.htmlDescription %}
    <div class="example__description">{{ example.htmlDescription | safe }}</div>
    {% endif %}
    <pre class="example__code"><code class="language-{{ example.type }}">{{ example.code | escape | safe }}</code></pre>
  </div>
  {% endfor %}
{% endif %}
