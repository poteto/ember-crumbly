import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import { lookupComponent } from '../helpers/lookup';

const {
  EnumerableUtils,
  run
} = Ember;

const {
  map,
  filter
} = EnumerableUtils;

let application;
let componentInstance;

module('Acceptance | ember-crumbly integration test', {
  beforeEach() {
    application = startApp();
    componentInstance = lookupComponent(application, 'bread-crumbs');
  },

  afterEach() {
    componentInstance = null;
    run(application, 'destroy');
  }
});

test('routeHierarchy returns the correct number of routes', function(assert) {
  assert.expect(2);
  visit('/foo/bar/baz');

  andThen(() => {
    const routeHierarchy = componentInstance.get('routeHierarchy');
    assert.equal(currentRouteName(), 'foo.bar.baz.index', 'correct current route name');
    assert.equal(routeHierarchy.length, 3, 'returns correct number of routes');
  });
});

test('routes that opt-out should not be shown', function(assert) {
  assert.expect(2);
  visit('/foo/bar/baz/hidden');

  andThen(() => {
    const routeHierarchy = componentInstance.get('routeHierarchy');
    assert.equal(currentRouteName(), 'foo.bar.baz.hidden', 'correct current route name');
    assert.equal(routeHierarchy.length, 3, 'returns correct number of routes');
  });
});

test('routes can set dynamic breadcrumb properties', function(assert) {
  assert.expect(4);
  visit('/foo/bar/baz/show');

  andThen(() => {
    const routeHierarchy = componentInstance.get('routeHierarchy');
    const routeTitles = map(routeHierarchy, (route) => route.title);
    const routeLooks = map(routeHierarchy, (route) => route.look);
    const hasDynamicTitle = filter(routeTitles, (title) => title === 'Derek Zoolander').length;
    const hasDynamicLook = filter(routeLooks, (look) => look === 'Blue Steel').length;

    assert.equal(currentRouteName(), 'foo.bar.baz.show', 'correct current route name');
    assert.equal(routeHierarchy.length, 4, 'returns correct number of routes');
    assert.ok(hasDynamicTitle, 'returns the correct dynamic title');
    assert.ok(hasDynamicLook, 'returns the correct arbitrary property');
  });
});
