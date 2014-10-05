{% if item.htmlAuthor %}
  <h3 class="item__sub-heading">Author{% if item.htmlAuthor.length > 1 %}s{% endif %}</h3>

  <ul class="list-unstyled">
    {% for author in item.htmlAuthor %}
      <li>{{ author | safe }}</li>
    {% endfor %}
  </ul>
{% endif %}
