import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import {
  lookupComponent,
  lookupRoute
} from '../helpers/lookup';

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

test('routes that opt-out are not  shown', function(assert) {
  assert.expect(2);
  visit('/foo/bar/baz/hidden');

  andThen(() => {
    const routeHierarchy = componentInstance.get('routeHierarchy');
    assert.equal(currentRouteName(), 'foo.bar.baz.hidden', 'correct current route name');
    assert.equal(routeHierarchy.length, 3, 'returns correct number of routes');
  });
});

test('routes can set dynamic breadcrumb props', function(assert) {
  assert.expect(5);
  visit('/foo/bar/baz/show');

  andThen(() => {
    const routeHierarchy = componentInstance.get('routeHierarchy');
    const routeTitles = map(routeHierarchy, (route) => route.title);
    const routeLooks = map(routeHierarchy, (route) => route.look);
    const routeLinkables = map(routeHierarchy, (route) => route.linkable);
    const hasDynamicTitle = filter(routeTitles, (title) => title === 'Derek Zoolander').length;
    const hasDynamicLook = filter(routeLooks, (look) => look === 'Blue Steel').length;
    const hasDynamicLinkable = filter(routeLinkables, (linkable) => linkable === false).length;
    assert.equal(currentRouteName(), 'foo.bar.baz.show', 'correct current route name');
    assert.equal(routeHierarchy.length, 4, 'returns correct number of routes');
    assert.ok(hasDynamicTitle, 'returns the correct title prop');
    assert.ok(hasDynamicLinkable, 'returns the correct linkable prop');
    assert.ok(hasDynamicLook, 'returns the correct arbitrary prop');
  });
});

test('routes that are not linkable do not generate an <a> tag', function(assert) {
  assert.expect(3);
  visit('/foo/bar/baz/');

  andThen(() => {
    const listElementsLength = find('#bootstrapLinkable li').length;
    const listAnchorElementsLength = find('#bootstrapLinkable li a').length;
    assert.equal(currentRouteName(), 'foo.bar.baz.index', 'correct current route name');
    assert.equal(listElementsLength, 3, 'returns the correct number of list elements');
    assert.equal(listAnchorElementsLength, 2, 'returns the correct number of list anchor elements');
  });
});

test('bread-crumbs component outputs the right class', function(assert) {
  assert.expect(3);
  visit('/foo');

  andThen(() => {
    const foundationList = find('#foundationLinkable');
    const bootstrapList = find('#bootstrapLinkable');
    const hasCorrectFoundationClass = foundationList.hasClass('breadcrumbs');
    const hasCorrectBootstrapClass = bootstrapList.hasClass('breadcrumb');
    assert.equal(currentRouteName(), 'foo.index', 'correct current route name');
    assert.ok(hasCorrectFoundationClass, 'returns the correct Foundation class');
    assert.ok(hasCorrectBootstrapClass, 'returns the correct Bootstrap class');
  });
});
