{% if item.htmlOutput[0] %}
  <h3 class="item__sub-heading">Output</h3>
  <p class="sassdoc__item-description">{{ item.htmlOutput[0] | safe }}</p>
{% endif %}
