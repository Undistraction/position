<!doctype html>

{% set project_title = package.title ? package.title : (package.name | capitalize) %}
{% set project_title = project_title | default('SassDoc') %}

<html lang="en">
<head>
  {# Include head content #}
  {% include "../includes/partials/head.html.swig" with project_title %}
</head>
<body>

  {# Sidebar #}
  <aside class="sidebar" role="nav">
    {% block sidebar %}{% endblock %}
  </aside>

  {# Main container #}
  <article class="main" role="main">

    {# Include top navbar #}
    {% include "../includes/partials/header.html.swig" with project_title %}

    <div class="container">
    {% block content %}{% endblock %}
    </div>

    {# Include footer #}
    {% include "../includes/partials/footer.html.swig" with project_title %}
  </article>


  {# Include scripts #}
  {% include "../includes/partials/scripts.html.swig" %}
</body>
</html>