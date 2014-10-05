{% if item.htmlThrows.length > 0 %}
  <h3 class="item__sub-heading">Throws</h3>

  <ul class="list-unstyled">
    {% for _throw in item.htmlThrows %}
      <li>{{ _throw | safe }}</li>
    {% endfor %}
  </ul>
{% endif %}
