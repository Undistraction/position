# Position

A set of mixins for handling position and offsets.

This project takes Hugo Giraudel's [mixin](http://hugogiraudel.com/2014/05/19/new-offsets-sass-mixin/) and adds some nice features including new keywords and support for custom units.

## Docs

You can view the docs online [here](http://undistraction.github.io/position/docs/) or locally in Chrome by running:

```
$ grunt docs
```

There is also a Grunt task to build the docs:

```
$ grunt sassdoc
```

## Tests

Tests are available from the excellent [Bootcamp](https://github.com/thejameskyle/bootcamp) and can
be run using:

```
$ grunt test
```

## API

The main mixin takes the following form:

- `position` is one of `absolute`, `fixed`, `relative` or static.
- `offsets` is a list of values defining the offsets

```
@include position(position, offsets);
```

There are four mixins to remove the need to set the postition value. They all take offsets as a
single argument, other than static which has no arguments as offsets will have no effect.

```
@include absolute(offsets);
@include fixed(offsets);
@include relative(offsets);
@include static;
```

The value for offsets is a list of keywords, some of which accept values which must follow those
keywords in the list. *Any combination* of the folowing values are supported, with values set in the order they are declared, meaning in the event of two values effecting the same offset, the value set by the last value will take precidence.

### Standard Offsets

You can use `top`, `bottom`, `left` and `right` either with or without a value:

```
.Example-without-value {
  @include absolute(top left);
}

.Example-with-value {
  @include absolute(top 1rem left 2rem);
}
```

Renders:

```
.Example-without-value {
  position: absolute;
  top: 0;
  left 0;
}

.Example-with-value {
  position: absolute;
  top: 1rem;
  left 2rem;
}
```

### Offset keywords

Offset keywords allow you to set offsets to a given value. *Note: `all` is aliased to `offset`:

```
.Example-with-offset {
  @include absolute(offset 2rem);
}

.Example-with-all {
  @include absolute(offset 2rem);
}

.Example-with-offset-h {
  @include absolute(offset-h 2rem);
}

.Example-with-offset-v {
  @include absolute(offset-v 2rem);
}
```

Renders:

```
.Example-with-offset {
  position: absolute;
  top: 2rem;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
}

.Example-with-all {
  position: absolute;
  top: 2rem;
  bottom: 2rem;
  left: 2rem;
  right: 2rem;
}

.Example-with-offset-h {
  position: absolute;
  left: 2rem;
  right: 2rem;
}

.Example-with-offset-v {
  position: absolute;
  top: 2rem;
  bottom: 2rem;
}
```

## Fill keywords

Fill keywords set the offsets to zero. They cannot be used with values and are equivalent to using
the offset keywords with a value of zero.

```
.Example-with-fill {
  @include absolute(fill);
}

.Example-with-fill-h {
  @include absolute(fill-h);
}

.Example-with-fill-v {
  @include absolute(fill-v);
}
```

Renders:

```
.Example-with-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.Example-with-fill-h {
  position: absolute;
  left: 0;
  right: 0;
}

.Example-with-fill-v {
  position: absolute;
  top: 0;
  bottom: 0;
}
```

## Using custom values

Position includes a hook; a function called `pos-parse-value-filter` which is passed two parameters; a value and an orientation (either horizontal or vertical). This hook will be called
when position comes across a value it doesn't know how to handle. By default this function throws
an error, but you can override this function and implement custom handling.

For example, if you want to use keywords to represent different sets of units to enforce consistancy, you could do this:

```
$custom-units-map: (
  single: 10px,
  double: 20px,
  triple: 30px
);

@function pos-parse-value-filter($value, $orientation){
  @if map-has-key($custom-units-map, $value) {
    @return map-get($custom-units-map, $value);
  } @else {
    @return pos-throw-error($pos-invalid-value-error, "Invalid value #{$value}");
  }
}
```

This feature will become very powerful when I add support for media queries.

## Dependencies & Compatability

It has no dependencies on other Sass libs and should work with Sass 3.3 and up, though it's currently only tested in 3.4.