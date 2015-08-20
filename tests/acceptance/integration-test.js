import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import {
  lookupComponent
} from '../helpers/lookup';

const { run } = Ember;

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
    const routeTitles = routeHierarchy.map((route) => route.title);
    const routeLooks = routeHierarchy.map((route) => route.look);
    const routeLinkables = routeHierarchy.map((route) => route.linkable);
    const hasDynamicTitle = routeTitles.filter((title) => title === 'Derek Zoolander').length;
    const hasDynamicLook = routeLooks.filter((look) => look === 'Blue Steel').length;
    const hasDynamicLinkable = routeLinkables.filter((linkable) => linkable === false).length;
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
  assert.expect(4);
  visit('/dessert/cookie');

  andThen(() => {
    const allListItems = find('ol#bootstrapLinkable li').text();
    const allLinkItems = find('ol#bootstrapLinkable li a').text();

    const hasDessertInallList = allListItems.indexOf('Dessert') >= 0;
    const hasCookieTextInallList = allListItems.indexOf('Cookie') >= 0;

    const hasDessertInLinkList = allLinkItems.indexOf('Dessert') >= 0;
    const doesNotHaveCookieInLinkList = allLinkItems.indexOf('Cookie') === -1;

    assert.ok(hasDessertInallList, 'renders the right inferred name');
    assert.ok(hasCookieTextInallList, 'renders the right inferred name');
    assert.ok(hasDessertInLinkList, 'renders the right inferred name');
    assert.ok(doesNotHaveCookieInLinkList, 'renders the right inferred name');
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

test('bread-crumbs component outputs crumbClass on li elements', function(assert) {
  assert.expect(2);
  visit('/foo/bar/baz');

  andThen(() => {
    const numberOfCustomCrumbClassItems = find('#customCrumbClass li').length;
    const numberOfCustomCrumbClassItemsByClass = find('#customCrumbClass li.breadcrumb-item').length;

    assert.equal(currentRouteName(), 'foo.bar.baz.index', 'correct current route name');
    assert.equal(numberOfCustomCrumbClassItems, numberOfCustomCrumbClassItemsByClass, 'renders the correct number of breadcrumbs with custom crumb class');
  });
});

test('bread-crumbs component outputs linkClass on a elements', function(assert) {
  assert.expect(2);
  visit('/foo/bar/baz');

  andThen(() => {
    const numberOfCustomLinkClassItems = find('#customLinkClass a').length;
    const numberOfCustomLinkClassItemsByClass = find('#customLinkClass a.breadcrumb-link').length;

    assert.equal(currentRouteName(), 'foo.bar.baz.index', 'correct current route name');
    assert.equal(numberOfCustomLinkClassItems, numberOfCustomLinkClassItemsByClass, 'renders the correct number of breadcrumbs with custom link class');
  });
});

test('bread-crumbs change when the route is changed', function(assert) {
  assert.expect(4);
  visit('/foo/bar/baz');

  andThen(() => {
    const lastCrumbText = find('#bootstrapLinkable li:last-child a').text().trim();

    assert.equal(currentRouteName(), 'foo.bar.baz.index', 'correct current route name');
    assert.equal(lastCrumbText, 'I am Baz', 'renders the correct last breadcrumb');
  });

  click('#bootstrapLinkable li:first-child a');

  andThen(() => {
    const lastCrumbText = find('#bootstrapLinkable li:last-child a').text().trim();

    assert.equal(currentRouteName(), 'foo.index', 'correct current route name (after transition)');
    assert.equal(lastCrumbText, 'I am Foo Index', 'renders the correct last breadcrumb (after transition)');
  });
});

test('bread-crumbs component updates when dynamic segments change', function(assert) {
  assert.expect(4);
  visit('/foo/bar/baz/1');

  andThen(() => {
    assert.equal(currentRouteName(), 'foo.bar.baz.show-with-params', 'correct current route name');
    assert.equal(Ember.$('#bootstrapLinkable li:last-child')[0].innerText.trim(), 'Derek Zoolander', 'crumb is based on dynamic segment');
  });

  click('#hansel');

  andThen(() => {
    assert.equal(currentRouteName(), 'foo.bar.baz.show-with-params', 'correct current route name');
    assert.equal(Ember.$('#bootstrapLinkable li:last-child')[0].innerText.trim(), 'Hansel McDonald', 'crumb is based on dynamic segment');
  });
});
