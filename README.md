# ember-crumbly

[![Build Status](https://travis-ci.org/poteto/ember-crumbly.svg)](https://travis-ci.org/poteto/ember-crumbly)

Adds a Component to your app that displays the current route hierarchy (commonly known as breadcrumb navigation). Thanks to [@rwjblue](https://github.com/rwjblue) for providing the excellent addon name.

This addon provides a very declarative way to generate dynamic breadcrumbs.

```sh
$ ember install ember-crumbly
```

## Usage

### Basic usage 
Basic usage is simple, just add the Component to any template in your application:

```hbs
{{bread-crumbs tagName="ol" outputStyle="bootstrap" linkable=true}}
{{bread-crumbs tagName="ul" outputStyle="foundation" linkable=false}}
```

This will automatically output the current route's hierarchy as a clickable breadcrumb in a HTML structure that Bootstrap or Foundation expects. By default, the Component will simply display the route's inferred name.

For example, the route `foo/bar/baz/1` will generate the following breadcrumb: `Foo > Bar > Baz > Show`. In most cases, this won't be exactly how you'd like it, so you can use the following declarative API to update the breadcrumb labels:

```js
// foo/route.js

export default Ember.Route.extend({
  breadCrumb: {
    title: 'Animals'
  }
});
```

```js
// foo/bar/route.js

export default Ember.Route.extend({
  breadCrumb: {
    title: 'Quadrupeds'
  }
});
```

```js
// foo/bar/baz/route.js

export default Ember.Route.extend({
  breadCrumb: {
    title: 'Cows'
  }
});
```

```js
// foo/bar/baz/show/route.js

export default Ember.Route.extend({
  breadCrumb: {},
  afterModel(model) {
    const cowName = get(model, 'name'); // 'Mary'

    const cow = {
      title: cowName
    }
    
    set(this, 'breadCrumb', cow);
  }
});
```

Will generate the following breadcrumb: `Animals > Quadrupeds > Cows > Mary`.

### Advanced usage
You can also pass in arbitrary properties to the `breadCrumb` POJO inside your route, and then pass in a custom template to the Component's block to render it the way you'd like:

```js
// foo/bar/baz/show/route.js

export default Ember.Route.extend({
  breadCrumb: {},
  afterModel(model) {
    const cowName = get(model, 'name'); // 'Mary'
    const cowAge = get(model, 'age');   // 5
    const cowSay = get(model, 'say');   // 'Moo!'

    const cow = {
      name: cowName,
      age: cowAge,
      says: cowSay
    }
    
    set(this, 'breadCrumb', cow);
  }
});
```

```hbs
{{#bread-crumbs outputStyle='bootstrap" linkable=true as |component cow|}}
  {{cow.name}} ({{cow.age}}) says {{cow.says}}
{{/bread-crumbs}}
```

Will generate the following breadcrumb: `Animals > Quadrupeds > Cows > Mary (5) says Moo!`

#### Choosing routes to display
By default, all routes are displayed in the breadcrumb. To have certain routes opt-out of this, simply set `breadCrumb` to `null` inside that particular route.

```js
// foo/bar/route.js

export default Ember.Route.extend({
  breadCrumb: null
});
```

Will generate the following breadcrumb: `Animals > Cows > Mary (5) says Moo!`

#### Explicitly setting linkable routes
The Component's `linkable` attr applies to all routes by default. You can also explicitly set this on specific routes, by adding `linkable: {true,false}` to the `breadCrumb` POJO in your route.

```js
// foo/bar/baz/show/route.js

export default Ember.Route.extend({
  breadCrumb: {
    title: 'Cows with a drinking addiction',
    linkable: false
  }
});
```

```js
// foo/bar/route.js

export default Ember.Route.extend({
  breadCrumb: {
    title: 'Quadrupeds',
    linkable: false
  }
});
```

Will generate the following breadcrumb: `_Animals_ > Quadrupeds > _Cows_ > Cows with a drinking addiction`. (`_name_` representing a link).

#### Set different HTML
The Component essentially generates a parent element, and iterates through the available routes in the hierarchy as child elements. By default, the parent element is a list `<ol>`,  and the child element is a list item `<li>`. You can override this by passing in the appropriate `tagName` and `crumbName` to the Component:

```hbs
{{bread-crumbs tagName="ul" outputStyle="foundation" linkable=true crumbTag="a" crumbClass="breadcrumb-item"}}
```

Which generates the following HTML:

```html
<!-- /foo/bar/baz/show/1 -->
<ul class="breadcrumbs">
  <li class="breadcrumb-item">
    <a id="ember404" class="ember-view" href="/foo">Animals</a>
  </li>
  <li class="breadcrumb-item">
    <a id="ember405" class="ember-view" href="/foo/bar">Quadrupeds</a>
  </li>
  <li class="breadcrumb-item">
    <a id="ember406" class="ember-view" href="/foo/bar/baz">Cows</a>
  </li>
  <li class="breadcrumb-item">
    <a id="ember407" class="ember-view active" href="/foo/bar/baz/show">Mary</a>
  </li>
</ul>
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
