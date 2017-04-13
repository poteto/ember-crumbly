import Ember from 'ember';
import layout from '../templates/components/bread-crumbs';
import getOwner from 'ember-getowner-polyfill';

const {
  get,
  Component,
  computed,
  copy,
  getWithDefault,
  assert,
  deprecate,
  isPresent,
  typeOf,
  setProperties,
  A: emberArray,
  String: { classify }
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
  currentUrl: readOnly('applicationRoute.router.url'),
  currentRouteName: readOnly('applicationRoute.controller.currentRouteName'),

  routeHierarchy: computed('currentUrl', 'currentRouteName', 'reverse', {
    get() {
      const currentRouteName = getWithDefault(this, 'currentRouteName', false);

      assert('[ember-crumbly] Could not find a current route', currentRouteName);

      const routeNames = currentRouteName.split('.');
      const filteredRouteNames = this._filterIndexAndLoadingRoutes(routeNames);
      const crumbs = this._lookupBreadCrumb(routeNames, filteredRouteNames);

      return get(this, 'reverse') ? crumbs.reverse() : crumbs;
    }
  }).readOnly(),

  breadCrumbClass: computed('outputStyle', {
    get() {
      let className = 'breadcrumb';
      const outputStyle = getWithDefault(this, 'outputStyle', '');
      if (isPresent(outputStyle)) {
        deprecate('outputStyle option will be deprecated in the next major release', false, { id: 'ember-crumbly.outputStyle', until: '2.0.0' });
      }
      const lowerCaseOutputStyle = outputStyle.toLowerCase();

      if (lowerCaseOutputStyle === 'foundation') {
        className = 'breadcrumbs';
      }

      return className;
    }
  }).readOnly(),

  _guessRoutePath(routeNames, name, index) {
    const lastIndex = routeNames.length - 1;
    const routes = routeNames.slice(0, index + 1);

    let path = routes.join('.');

    if (routes.length === lastIndex && routeNames[lastIndex] === 'index' && name !== 'index') {
      let fullPath = `${path}.index`;

      if (this._lookupRoute(fullPath)) {
        return fullPath;
      }
    }

    return path;
  },

  _filterIndexAndLoadingRoutes(routeNames) {
    const filteredRouteNames = routeNames.filter((name) => (name !== 'loading'));

    while (filteredRouteNames[filteredRouteNames.length - 1] === 'index') {
      filteredRouteNames.pop();
    }

    return filteredRouteNames;
  },

  _lookupRoute(routeName) {
    return getOwner(this).lookup(`route:${routeName}`);
  },

  _lookupBreadCrumb(routeNames, filteredRouteNames) {
    const defaultLinkable = get(this, 'linkable');
    const pathLength = filteredRouteNames.length;
    const breadCrumbs = filteredRouteNames.map((name, index) => {
      let path = this._guessRoutePath(routeNames, name, index);
      const route = this._lookupRoute(path);
      const isHead = index === 0;
      const isTail = index === pathLength - 1;

      const crumbLinkable = (index === pathLength - 1) ? false : defaultLinkable;

      assert(`[ember-crumbly] \`route:${path}\` was not found`, route);

      let breadCrumb = copy(getWithDefault(route, 'breadCrumb', {
        title: classify(name)
      }));

      if (typeOf(breadCrumb) === 'null') {
        return;
      } else {
        if (isPresent(breadCrumb.path)) {
          path = breadCrumb.path;
        }

        setProperties(breadCrumb, {
          path,
          isHead,
          isTail,
          linkable: breadCrumb.hasOwnProperty('linkable') ? breadCrumb.linkable : crumbLinkable
        });
      }

      return breadCrumb;
    });

    return emberArray(breadCrumbs.filter((breadCrumb) => typeOf(breadCrumb) !== 'undefined'));
  }
});
