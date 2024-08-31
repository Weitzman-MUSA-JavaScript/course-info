# CSS Selectors

CSS selectors are a query syntax. With them, you are querying the document to
find elements that match the selector. Various types of selectors can be mixed
and combined into some pretty sophisticated queries, but we'll just cover some
of the basic selectors here.

### Basic CSS Selector Syntax

Types of basic selectors:
* Tag name selectors
* ID selectors
* Class selectors
* Attribute selectors
* Universal selectors
* Relational selectors

#### Tag Name Selector

Selects HTML elements by tag name. For example, the following CSS will give all
`<p>` elements on a page centered text:

```css
p {
  text-align: center;
}
```

#### ID Selector

Select the HTML element with the specific ID attribute. An ID selector is
written with a hash character (`#`) followed by the `id` of the element. For
example, the following CSS will give the element with `id="my-title"` bolded
text. It doesn't care if the element is a paragraph, a heading, or anything
else:

```css
#my-title {
  font-weight: bold;
}
```

#### Class Selector

Select the HTML elements with the specific class attribute. A class can belong
to multiple elements, and each element can have multiple classes. A class
selector is written with a dot character (`.`) followed by the `class` of the
element. For example, the following CSS will give the elements with a `class`
attribute containing `"my-special-class"` a yellow background, regardless of the
ID or types of the elements:

```css
.my-special-class {
  background-color: yellow;
}
```

#### Attribute Selector

Select HTML elements with a specific attribute or attribute value. An attribute
selector is written with square brackets (`[]`). For example, the following CSS
will give all elements with a `type` attribute set to `"checkbox"` a red border:

```css
[type="checkbox"] {
  border: 1px solid red;
}
```

#### Universal Selector

Select HTML elements of any type with any attributes. A universal selector is
written with an asterisk character (`*`). For example, with this code we can set
the font on all elements to Comic Sans MS:

```css
* {
  font-family: 'Comic Sans MS';
}
```

#### Relational Selector

Select HTML elements based on their relationship to other elements. For example,
the following CSS will give all `<p>` elements that are direct children of any element with the class `alert` a red border:

```css
.alert > p {
  border: 1px solid red;
}
```

There are a number of relational selectors. Let's assume you have two selectors `E` and `F`. You could build the following types of relational selectors:
* `E F {...}` - Selects any `F` element that is a **descendant** of an `E` element.
* `E > F {...}` - Selects any `F` element that is a **child** of an `E` element.
* `E ~ F {...}` - Selects any `F` element that is a **sibling** of an `E` element.
* `E + F {...}` - Selects any `F` element that is a **sibling that _immediately follows_** an `E` element.

#### More Complex Selectors

You can combine CSS selectors to create more complex element queries. Just as an exaple, here is a selector that matches the first `<div>` element within each `<section>` element:

```css
section > div:first-child {
  ...
}
```

And here's a selector that matches each odd `<li>` element (e.g., the 1st, 3rd, 5th, etc.) inside of lists with a `striped-list` class:

```css
.striped-list > li:nth-child(odd) {
  ...
}
```

## References
* For more information, see the [MDN documentation on CSS Selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors).
