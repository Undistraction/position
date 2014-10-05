{% if item.htmlTodo.length > 0 %}
  <h3 class="item__sub-heading">TODO's</h3>

  <ul class="list-unstyled">
    {% for todo in item.htmlTodo %}
      <li>{{ todo | safe }}</li>
    {% endfor %}
  </ul>
{% endif %}
