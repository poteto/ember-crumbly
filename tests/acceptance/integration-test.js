import {
  click,
  currentRouteName,
  find,
  findAll,
  visit
} from '@ember/test-helpers';
import $ from 'jquery';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | ember-crumbly integration test', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    this.componentInstance = this.owner.lookup('component:bread-crumbs');
  });

  hooks.afterEach(function() {
    this.componentInstance = null;
  });

  test('routeHierarchy returns the correct number of routes', async function(assert) {
    assert.expect(3);
    await visit('/foo/bar/baz');

    const routeHierarchy = this.componentInstance.get('routeHierarchy');
    const numberOfRenderedBreadCrumbs = findAll('#bootstrapLinkable li').length;
    assert.equal(currentRouteName(), 'foo.bar.baz.index', 'correct current route name');
    assert.equal(routeHierarchy.length, 3, 'returns correct number of routes');
    assert.equal(numberOfRenderedBreadCrumbs, 3, 'renders the correct number of breadcrumbs');
  });

  test('routes that opt-out are not shown', async function(assert) {
    assert.expect(3);
    await visit('/foo/bar/baz/hidden');

    const routeHierarchy = this.componentInstance.get('routeHierarchy');
    const numberOfRenderedBreadCrumbs = findAll('#foundationLinkable li').length;
    assert.equal(currentRouteName(), 'foo.bar.baz.hidden', 'correct current route name');
    assert.equal(routeHierarchy.length, 3, 'returns correct number of routes');
    assert.equal(numberOfRenderedBreadCrumbs, 3, 'renders the correct number of breadcrumbs');
  });

  test('top-level flat routes render correctly', async function(assert) {
    assert.expect(4);
    await visit('/about');

    const breadCrumbs = await findAll('#foundationLinkable li');
    const routeHierarchy = this.componentInstance.get('routeHierarchy');
    const numberOfRenderBreadCrumbs = breadCrumbs.length;
    assert.equal(currentRouteName(), 'about', 'correct current route name');
    assert.equal(routeHierarchy.length, 1, 'returns correct number of routes');
    assert.equal(numberOfRenderBreadCrumbs, 1, 'renders the correct number of breadcrumbs');
    assert.equal(breadCrumbs[0].textContent.trim(), 'About Derek Zoolander', 'uses flat route breadcrumb settings');
  });

  test('routes can set dynamic breadcrumb props', async function(assert) {
    assert.expect(5);
    await visit('/foo/bar/baz/show');

    const routeHierarchy = this.componentInstance.get('routeHierarchy');
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

  test('breadcrumb data includes isTail and isHead', async function(assert) {
    assert.expect(4);
    await visit('/foo/bar/baz/show');

    const routeHierarchy = this.componentInstance.get('routeHierarchy');

    assert.equal(routeHierarchy[0].isHead, true, 'first route is head');
    assert.equal(routeHierarchy[1].isHead, false, 'second route is not head');
    assert.equal(routeHierarchy[0].isTail, false, 'first route is not tail');
    assert.equal(routeHierarchy[routeHierarchy.length - 1].isTail, true, 'last route is tail');
  });

  test('first route is tail and head when on root', async function(assert) {
    assert.expect(3);
    await visit('/foo');

    const routeHierarchy = this.componentInstance.get('routeHierarchy');

    assert.equal(routeHierarchy.length, 1, 'There is 1 route');
    assert.equal(routeHierarchy[0].isHead, true, 'first route is head');
    assert.equal(routeHierarchy[0].isTail, true, 'first route is tail');
  });

  test('routes that are not linkable do not generate an <a> tag', async function(assert) {
    assert.expect(3);
    await visit('/foo/bar/baz/');

    const listElementsLength = findAll('#bootstrapLinkable li').length;
    const listAnchorElementsLength = findAll('#bootstrapLinkable li a').length;
    assert.equal(currentRouteName(), 'foo.bar.baz.index', 'correct current route name');
    assert.equal(listElementsLength, 3, 'returns the correct number of list elements');
    assert.equal(listAnchorElementsLength, 2, 'returns the correct number of list anchor elements');
  });

  test('bread-crumbs component outputs the right class', async function(assert) {
    assert.expect(3);
    await visit('/foo');

    assert.equal(currentRouteName(), 'foo.index', 'correct current route name');

    assert.dom('ul#foundationLinkable').hasClass('breadcrumbs', 'returns the correct Foundation class');
    assert.dom('ol#bootstrapLinkable').hasClass('breadcrumb', 'returns the correct Bootstrap class');
  });

  test('bread-crumbs component accepts a block', async function(assert) {
    assert.expect(4);
    await visit('/animal/quadruped/cow/show');

    const listItems = await findAll('#customBlock li span');
    assert.equal(currentRouteName(), 'animal.quadruped.cow.show', 'correct current route name');
    assert.equal(listItems[0].textContent, 'Derek Zoolander\'s Zoo for Animals Who Can\'t Read Good and Want to Do Other Stuff Good Too', 'returns the right text');
    assert.equal(listItems[1].textContent, 'Cows', 'returns the right text');
    assert.equal(listItems[2].textContent, 'Mary (5 years old)', 'returns the right text');
  });

  test('routes with no breadcrumb should render with their capitalized inferred name', async function(assert) {
    assert.expect(4);
    await visit('/dessert/cookie');

    const allListItems = await findAll('ol#bootstrapLinkable li').map(el => el.textContent.trim());
    const allLinkItems = await findAll('ol#bootstrapLinkable li a').map(el => el.textContent.trim());

    const hasDessertInallList = allListItems.indexOf('Dessert') >= 0;
    const hasCookieTextInallList = allListItems.indexOf('Cookie') >= 0;

    const hasDessertInLinkList = allLinkItems.indexOf('Dessert') >= 0;
    const doesNotHaveCookieInLinkList = allLinkItems.indexOf('Cookie') === -1;

    assert.ok(hasDessertInallList, 'renders the right inferred name');
    assert.ok(hasCookieTextInallList, 'renders the right inferred name');
    assert.ok(hasDessertInLinkList, 'renders the right inferred name');
    assert.ok(doesNotHaveCookieInLinkList, 'renders the right inferred name');
  });

  test('absence of reverse option renders breadcrumb right to left', async function(assert) {
    assert.expect(2);
    await visit('/foo/bar/baz');

    const numberOfRenderedBreadCrumbs = findAll('#bootstrapLinkable li').length;
    assert.equal(numberOfRenderedBreadCrumbs, 3, 'renders the correct number of breadcrumbs');
    assert.deepEqual(
      $('#bootstrapLinkable li').map((idx, item) => item.innerText.trim()).toArray(),
      ['I am Foo', 'I am Bar', 'I am Baz']);
  });

  test('reverse option = TRUE renders breadcrumb from left to right', async function(assert) {
    assert.expect(2);
    await visit('/foo/bar/baz');

    const numberOfRenderedBreadCrumbs = findAll('#reverseBootstrapLinkable li').length;
    assert.equal(numberOfRenderedBreadCrumbs, 3, 'renders the correct number of breadcrumbs');
    assert.deepEqual(
      $('#reverseBootstrapLinkable li').map((idx, item) => item.innerText.trim()).toArray(),
      ['I am Baz', 'I am Bar', 'I am Foo']);
  });

  test('bread-crumbs component outputs crumbClass on li elements', async function(assert) {
    assert.expect(2);
    await visit('/foo/bar/baz');

    const numberOfCustomCrumbClassItems = findAll('#customCrumbClass li').length;
    const numberOfCustomCrumbClassItemsByClass = findAll('#customCrumbClass li.breadcrumb-item').length;

    assert.equal(currentRouteName(), 'foo.bar.baz.index', 'correct current route name');
    assert.equal(numberOfCustomCrumbClassItems, numberOfCustomCrumbClassItemsByClass, 'renders the correct number of breadcrumbs with custom crumb class');
  });

  test('bread-crumbs component outputs linkClass on a elements', async function(assert) {
    assert.expect(2);
    await visit('/foo/bar/baz');

    const numberOfCustomLinkClassItems = findAll('#customLinkClass a').length;
    const numberOfCustomLinkClassItemsByClass = findAll('#customLinkClass a.breadcrumb-link').length;

    assert.equal(currentRouteName(), 'foo.bar.baz.index', 'correct current route name');
    assert.equal(numberOfCustomLinkClassItems, numberOfCustomLinkClassItemsByClass, 'renders the correct number of breadcrumbs with custom link class');
  });

  test('bread-crumbs change when the route is changed', async function(assert) {
    assert.expect(4);
    await visit('/foo/bar/baz');

    let lastCrumbText = find('#bootstrapLinkable li:last-child').textContent.trim();

    assert.equal(currentRouteName(), 'foo.bar.baz.index', 'correct current route name');
    assert.equal(lastCrumbText, 'I am Baz', 'renders the correct last breadcrumb');

    await click('#bootstrapLinkable li:first-child a');

    lastCrumbText = find('#bootstrapLinkable li:last-child').textContent.trim();

    assert.equal(currentRouteName(), 'foo.index', 'correct current route name (after transition)');
    assert.equal(lastCrumbText, 'I am Foo Index', 'renders the correct last breadcrumb (after transition)');
  });

  test('bread-crumbs component updates when dynamic segments change', async function(assert) {
    assert.expect(4);
    await visit('/foo/bar/baz/1');

    assert.equal(currentRouteName(), 'foo.bar.baz.show-with-params', 'correct current route name');
    assert.equal(await findAll('#bootstrapLinkable li')[3].innerText.trim(), 'Derek Zoolander', 'crumb is based on dynamic segment');

    await click(find('#hansel'));

    assert.equal(currentRouteName(), 'foo.bar.baz.show-with-params', 'correct current route name');
    assert.equal(findAll('#bootstrapLinkable li')[3].innerText.trim(), 'Hansel McDonald', 'crumb is based on dynamic segment');
  });

  test('parent route becomes linkable when navigating to child', async function(assert) {
    assert.expect(4);
    await visit('/foo/bar');

    let numberOfRenderedBreadCrumbs = findAll('#bootstrapLinkable li').length;
    let numberOfRenderedLinkBreadCrumbs = findAll('#bootstrapLinkable li a').length;

    assert.equal(numberOfRenderedBreadCrumbs, 2, 'renders correct number of bread crumbs');
    assert.equal(numberOfRenderedLinkBreadCrumbs, 1, 'renders correct number of links');

    await visit('/foo/bar/baz');

    numberOfRenderedBreadCrumbs = findAll('#bootstrapLinkable li').length;
    numberOfRenderedLinkBreadCrumbs = findAll('#bootstrapLinkable li a').length;

    assert.equal(numberOfRenderedBreadCrumbs, 3, 'renders correct number of bread crumbs');
    assert.equal(numberOfRenderedLinkBreadCrumbs, 2, 'renders correct number of links');
  });

  test('uses path from breadCrumb if present', async function(assert) {
    assert.expect(2);
    await visit('/bar/baz');

    assert.equal(currentRouteName(), 'bar.baz', 'correct current route name');

    await click('#bootstrapLinkable li:first-child a');

    assert.equal(currentRouteName(), 'foo.index', 'correct current route name');
  });
});
