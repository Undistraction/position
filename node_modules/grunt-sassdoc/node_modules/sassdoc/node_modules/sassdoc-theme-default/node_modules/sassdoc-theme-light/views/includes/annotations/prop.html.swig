{% if item.prop.length > 0 %}

<h3 class="item__sub-heading">Map structure</h3>

<table class="item__parameters">
  <thead>
    <tr>
      <th scope="col"><span class="visually-hidden">{{ item.type }} key </span>Name</th>
      <th scope="col"><span class="visually-hidden">{{ item.type }} key </span>Description</th>
      <th scope="col"><span class="visually-hidden">{{ item.type }} key </span>Type</th>
      <th scope="col"><span class="visually-hidden">{{ item.type }} key </span>Value</th>
    </tr>
  </thead>

  <tbody>
    {% for prop in item.prop %}
      <tr class="item__parameter">
        <th scope="row" data-label="name"><code>{{ prop.name }}</code></th>
        <td data-label="desc">{{ prop.htmlDescription | default('&mdash;<span class="visually-hidden"> none</span>') | safe }}</td>
        <td data-label="type">
        {{ prop.type | split('|') | trim | capitalize | join(', ') }}
        </td>
        <td data-label="default">
        {% if not prop.default %}
          &mdash;<span class="visually-hidden"> none</span>
        {% else %}
          <code>{{ prop.default }}</code>
        {% endif %}
        </td>
      </tr>
    {% endfor %}
  </tbody>
</table>

{% endif %}
