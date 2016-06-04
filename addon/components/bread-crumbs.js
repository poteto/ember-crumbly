import Ember from 'ember';
import layout from '../templates/components/bread-crumbs';
import computed from 'ember-new-computed';
import getOwner from 'ember-getowner-polyfill';

const {
        get,
        Component,
        getWithDefault,
        assert,
        setProperties,
        A: emberArray,
        String: { classify },
        inject
      } = Ember;
const {
        bool,
        readOnly
      } = computed;

export default Component.extend({
  layout,
  tagName: 'ol',
  linkable: true,
  reverse: false,
  classNameBindings: ['breadCrumbClass'],
  hasBlock: bool('template').readOnly(),
  routing: inject.service('-routing'),
  currentUrl: readOnly('routing.router.url'),
  currentRouteName: readOnly('routing.currentRouteName'),

  routeHierarchy: computed('currentUrl', 'reverse', function() {
    const currentRouteName = get(this, 'currentRouteName');
    assert('[ember-crumbly] Could not find a curent route', currentRouteName);

    const routeNames = currentRouteName.split('.');
    const filteredRouteNames = this._filterIndexAndLoadingRoutes(routeNames);
    const crumbs = this._lookupBreadCrumb(routeNames, filteredRouteNames);

    return get(this, 'reverse') ? crumbs.reverse() : crumbs;
  }).readOnly(),

  breadCrumbClass: computed('outputStyle', function() {
    const outputStyle = getWithDefault(this, 'outputStyle', '');
    return (outputStyle.match(/foundation/i)) ? 'breadcrumbs' : 'breadcrumb';
  }).readOnly(),

  _guessRoutePath(routeNames, name, index) {
    const routes = routeNames.slice(0, index + 1);

    if (routes.length === 1) {
      let path = `${name}.index`;

      return (this._lookupRoute(path)) ? path : name;
    }

    return routes.join('.');
  },

  _filterIndexAndLoadingRoutes(routeNames) {
    return routeNames.filter((name) => !(name.match(/^(index|loading)$/)));
  },

  _lookupRoute(routeName) {
    return getOwner(this).lookup(`route:${routeName}`);
  },

  _lookupBreadCrumb(routeNames, filteredRouteNames) {
    const defaultLinkable = get(this, 'linkable');
    const pathLength = routeNames.length;

    return emberArray(filteredRouteNames.map((name, index) => {
      const path = this._guessRoutePath(routeNames, name, index);
      const route = this._lookupRoute(path);

      assert(`[ember-crumbly] \`route:${path}\` was not found`, route);

      let breadCrumb = getWithDefault(route, 'breadCrumb', {
        title: classify(name)
      });

      if (breadCrumb) {
        const crumbLinkable = (index === pathLength - 1) ? false : defaultLinkable;
        setProperties(breadCrumb, {
          path,
          linkable: breadCrumb.hasOwnProperty('linkable') ? breadCrumb.linkable : crumbLinkable
        });
        return breadCrumb;
      }

    })).compact();
  }
});