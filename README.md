# Position

A set of mixins for handling position and offsets.

This project takes Hugo Giraudel's [mixin](http://hugogiraudel.com/2014/05/19/new-offsets-sass-mixin/) and adds some nice features.

## Dependencies & Compatability

It has no dependencies on other Sass libs and should work with Sass 3.3 and up, though it's currently only tested in 3.4.

## API

The main mixin takes the following form:

- `position` is one of `absolute`, `fixed` or `relative`.
- `offsets` is a list of values defining the offsets

```
@include position(position, offsets);
```

There are three mixins to remove the need to set the postition value. They all take offsets as a
single argument:

```
@include position-absolute(offsets);
@include position-fixed(offsets);
@include position-relative(offsets);
```

The value for offsets is a list of keywords, some of which accept values which must follow those
keywords in the list. *Any combination* of the folowing values are supported, with values set in the order they are declared, meaning in the event of two values effecting the same offset, the value set by the last value will take precidence.

### Standard Offsets

You can use `top`, `bottom`, `left` and `right` either with or without a value:

```
.Example-without-value {
  @include position-absolute(top left);
}

.Example-with-value {
  @include position-absolute(top 1rem left 2rem);
}
```

Renders:

```
.Example-without-value {
  position: absolute;
  top: 0;
  left 0;
}

.Example-without-value {
  position: absolute;
  top: 1rem;
  left 1rem;
}
```

### Offset keywords

Offset keywords allow you to set offsets to a given value:

```
.Example-with-offset {
  @include position-absolute(offset 2rem);
}

.Example-with-offset-h {
  @include position-absolute(offset-h 2rem);
}

.Example-with-offset-v {
  @include position-absolute(offset-v 2rem);
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
  @include position-absolute(fill);
}

.Example-with-fill-h {
  @include position-absolute(fill-h);
}

.Example-with-fill-v {
  @include position-absolute(fill-v);
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