<section class="main__item  item{% if item.alias %}  item--alias{% endif %}{% if item.deprecated %}  item--deprecated{% endif %}" id="{{ item.context.type }}-{{ item.context.name }}">

{% include '../annotations/name.html.swig' %}

{% include '../annotations/deprecated.html.swig' %}

{% include '../annotations/preview.html.swig' %}

{% if not item.alias %}

  {% for annotation in view.display.annotations[item.context.type] %}
    {% set path = '../annotations/' + annotation + '.html.swig' %}
    {% include path %}
  {% endfor %}

{% else %}

  <p>Refer to <a href="#{{ item.context.type }}-{{ item.alias[0] }}">{{ item.alias[0] }}</a>.</p>

{% endif %}

</section>