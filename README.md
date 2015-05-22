# ember-crumbly

Adds a Component to your app that displays the current route hierarchy (commonly known as breadcrumb navigation). Thanks to @rwjblue for providing the excellent addon name.

This addon differentiates itself from other similar addons by providing a very declarative way to generate dynamic breadcrumbs.

```sh
$ ember install ember-crumbly
```

## Usage

### Basic usage 
Basic usage is simple, just add the Component to any template in your application.

```hbs
{{bread-crumbs outputStyle="bootstrap" linkable=true}}
```

This will automatically output the current route's hierarchy as a clickable breadcrumb in a HTML structure that Bootstrap or Foundation expects. By default, the Component will simply display the route's inferred name.

For example, the route `foo/bar/baz/1` will display the following breadcrumb: `Foo > Bar > Baz > Show`. In most cases, this won't be exactly how you'd like it, so you can use the following declarative API to update the breadcrumb labels:

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
  breadCrumb: null,
  afterModel(model) {
    const breadCrumb = get(this, 'breadCrumb');
    const cowName = get(this, 'model.name'); // 'Mary'
    
    breadCrumb.set('title', cowName);
  }
});
```

Will generate the following breadcrumb: `Animals > Quadrupeds > Cows > Mary`.

### Advanced usage
You can also pass in arbitrary properties to the breadCrumb POJO inside your route, and then pass in a custom template to the Component's block to render it the way you'd like:

```js
// foo/bar/baz/show/route.js

export default Ember.Route.extend({
  breadCrumb: null,
  afterModel(model) {
    const breadCrumb = get(this, 'breadCrumb');
    const cowName = get(this, 'model.name'); // 'Mary'
    const cowAge = get(this, 'model.age');   // 5
    const cowSay = get(this, 'model.say');   // 'Moo!'
    
    breadCrumb.setProperties({
      name: cowName,
      age: cowAge,
      says: cowSay
    });
  }
});
```

```hbs
{{bread-crumbs outputStyle="bootstrap" linkable=true as |component cow|}}
  {{cow.name}} ({{cow.age}}) says {{cow.says}}
{{/bread-crumbs}}
```

Which generates the following breadcrumb: `Animals > Quadrupeds > Cows > Mary (5) says Moo!`

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
