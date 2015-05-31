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
  assert.expect(3);
  visit('/foo/bar/baz');

  andThen(() => {
    const routeHierarchy = componentInstance.get('routeHierarchy');
    const numberOfRenderedBreadCrumbs = find('#bootstrapLinkable li').length;
    assert.equal(currentRouteName(), 'foo.bar.baz.index', 'correct current route name');
    assert.equal(routeHierarchy.length, 3, 'returns correct number of routes');
    assert.equal(numberOfRenderedBreadCrumbs, 3, 'renders the correct number of breadcrumbs');
  });
});

test('routes that opt-out are not shown', function(assert) {
  assert.expect(3);
  visit('/foo/bar/baz/hidden');

  andThen(() => {
    const routeHierarchy = componentInstance.get('routeHierarchy');
    const numberOfRenderedBreadCrumbs = find('#foundationLinkable li').length;
    assert.equal(currentRouteName(), 'foo.bar.baz.hidden', 'correct current route name');
    assert.equal(routeHierarchy.length, 3, 'returns correct number of routes');
    assert.equal(numberOfRenderedBreadCrumbs, 3, 'renders the correct number of breadcrumbs');
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
    const foundationList = find('ul#foundationLinkable');
    const bootstrapList = find('ol#bootstrapLinkable');
    const hasCorrectFoundationClass = foundationList.hasClass('breadcrumbs');
    const hasCorrectBootstrapClass = bootstrapList.hasClass('breadcrumb');
    assert.equal(currentRouteName(), 'foo.index', 'correct current route name');
    assert.ok(hasCorrectFoundationClass, 'returns the correct Foundation class');
    assert.ok(hasCorrectBootstrapClass, 'returns the correct Bootstrap class');
  });
});

test('bread-crumbs component accepts a block', function(assert) {
  assert.expect(2);
  visit('/animal/quadruped/cow/show');

  andThen(() => {
    const listItemsText = find('#customBlock li span').text();
    assert.equal(currentRouteName(), 'animal.quadruped.cow.show', 'correct current route name');
    assert.equal(listItemsText, 'Animals at the ZooCowsMary (5 years old)', 'returns the right text');
  });
});

test('routes with no breadcrumb should render with their capitalized inferred name', function(assert) {
  assert.expect(2);
  visit('/dessert/cookie');

  andThen(() => {
    const listItemsText = find('ol#bootstrapLinkable li a').text();
    const hasDessertText = listItemsText.indexOf('Dessert') >= 0;
    const hasCookieText = listItemsText.indexOf('Cookie') >= 0;
    assert.ok(hasDessertText, 'renders the right inferred name');
    assert.ok(hasCookieText, 'renders the right inferred name');
  });
});

test('absence of reverse option renders breadcrumb right to left', function(assert) {
  assert.expect(2);
  visit('/foo/bar/baz');

  andThen(() => {
    const numberOfRenderedBreadCrumbs = find('#bootstrapLinkable li').length;
    assert.equal(numberOfRenderedBreadCrumbs, 3, 'renders the correct number of breadcrumbs');
    assert.deepEqual(
      Ember.$('#bootstrapLinkable li').map((idx, item) => item.innerText.trim()).toArray(),
      ['I am Foo Index', 'I am Bar', 'I am Baz']);
  });
});

test('reverse option = TRUE renders breadcrumb from left to right', function(assert) {
  assert.expect(2);
  visit('/foo/bar/baz');

  andThen(() => {
    const numberOfRenderedBreadCrumbs = find('#reverseBootstrapLinkable li').length;
    assert.equal(numberOfRenderedBreadCrumbs, 3, 'renders the correct number of breadcrumbs');
    assert.deepEqual(
      Ember.$('#reverseBootstrapLinkable li').map((idx, item) => item.innerText.trim()).toArray(),
      ['I am Baz', 'I am Bar', 'I am Foo Index']);
  });
});
