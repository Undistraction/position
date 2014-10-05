{% if item.since.length > 1 %}
  <h3 class="item__sub-heading">Changelog</h3>

  <ul class="list-unstyled">
    {% for since in item.since %}
      <li>{{ since.version | safe }} - {{ since.description }}</li>
    {% endfor %}
  </ul>
{% endif %}
