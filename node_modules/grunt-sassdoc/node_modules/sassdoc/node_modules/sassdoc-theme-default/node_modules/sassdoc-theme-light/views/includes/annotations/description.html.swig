{% if item.htmlDescription %}
  <h3 class="item__sub-heading">Description</h3>

  <div class="item__description">{{ item.htmlDescription | safe }}</div>
{% endif %}
