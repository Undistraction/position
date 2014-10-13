# Position

Position is set of mixins for handling position and offsets.

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

You can play with the latest version in a Sassmeister gist [here](http://sassmeister.com/gist/cdf30d3c1be08ee66b38).

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

### Fill keywords

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

### Using custom values

Where things get interesting is a function called `position-parse-value-filter`. This function is called when a value isn't recognised (it is an unknown, unitless value). By default it will throw an error, but by overriding this function (by declaring a function with the same name and signiture after you've imported position), you can process this value yourself.

For example, most projects are full hardcoded position-property declarations which quickly become inconsistant and ad-hoc. Why not enforce consistancy and improve readability on your projectby using a set of custom units:

```

// Define a map of units
$custom-units-map: (
  hairline: 1px,
  single: 10px,
  double: 20px,
  triple: 30px,
  quadruple: 40px,
  half: 5px,
  third: 3.33333333px,
  quarter: 2,5px
);

// Override
@function position-parse-value-filter($key, $orientation){
  @if map-has-key($custom-units-map, $key) {
    @return map-get($custom-units-map, $key);
  } @else {
    // If it isn't recognised throw an error
    // Unfortunately Sass doesn't allow us to call super.
    @return position-throw-error($position-invalid-value-error, "Invalid value #{$value}");
  }
}

// Then you can use

.Example {
  @include fixed(fill-h single top triple bottom third);
}

```

There is a lot more that you can do with this simple functionality. For example you could use unitless values in the `$custom-units-map` and multiply them with a vertical rhythm unit, or
use breakpoint context to tweak these units across breakpoints, so that a declaration of `single` can mean different values at different breakpoints. *More examples coming soon.*

## Dependencies & Compatability

It has no dependencies on other Sass libs and should work with Sass 3.3 and up, though it's currently only tested in 3.4.