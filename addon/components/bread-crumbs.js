import Ember from 'ember';
import layout from '../templates/components/bread-crumbs';

const {
  get,
  Component,
  computed,
  getWithDefault,
  assert,
  typeOf,
  setProperties,
  A: emberArray,
  String: { classify },
  merge,
  copy
} = Ember;

export default Component.extend({
  layout,
  tagName: 'ol',
  linkable: true,
  reverse: false,
  classNameBindings: [ 'breadCrumbClass' ],
  hasBlock: computed.bool('template').readOnly(),
  currentUrl: computed.readOnly('applicationRoute.router.url'),
  currentRouteName: computed.readOnly('applicationRoute.controller.currentRouteName'),

  routeHierarchy: computed('currentUrl', 'reverse', {
    get() {
      const currentRouteName = getWithDefault(this, 'currentRouteName', false);

      assert('[ember-crumbly] Could not find a curent route', currentRouteName);

      const routeNames = this._splitCurrentRouteName(currentRouteName);
      const filteredRouteNames = this._filterIndexRoutes(routeNames);

      const crumbs = this._lookupBreadCrumb(routeNames, filteredRouteNames);
      return this.get('reverse') ? crumbs.reverse() : crumbs;
    }
  }).readOnly(),

  breadCrumbClass: computed('outputStyle', {
    get() {
      let className = 'breadcrumb';
      const outputStyle = getWithDefault(this, 'outputStyle', '');
      const lowerCaseOutputStyle = outputStyle.toLowerCase();

      if (lowerCaseOutputStyle === 'foundation') {
        className = 'breadcrumbs';
      }

      return className;
    }
  }).readOnly(),

  _splitCurrentRouteName(currentRouteName) {
    return currentRouteName.split('.');
  },

  _guessRoutePath(routeNames, name, index) {
    const routes = routeNames.slice(0, index + 1);

    if (routes.length === 1) {
      return `${name}.index`;
    } else {
      return routes.join('.');
    }
  },

  _filterIndexRoutes(routeNames) {
    return routeNames.filter((name) => name !== 'index');
  },

  _lookupRoute(routeName) {
    const container = get(this, 'container');
    const route = container.lookup(`route:${routeName}`);
    assert(`[ember-crumbly] \`route:${routeName}\` was not found`, route);

    return route;
  },

  _lookupBreadCrumb(routeNames, filteredRouteNames) {
    let defaultLinkable = get(this, 'linkable');
    const pathLength = filteredRouteNames.length;
    const breadCrumbs = filteredRouteNames.map((name, index) => {
      const path = this._guessRoutePath(routeNames, name, index);
      let breadCrumb = this._lookupRoute(path).getWithDefault('breadCrumb', undefined);
      const breadCrumbType = typeOf(breadCrumb);

      if (index === (pathLength - 1)) {
        defaultLinkable = false;
      }

      if (breadCrumbType === 'undefined') {
        breadCrumb = {
          path,
          linkable: defaultLinkable,
          title: classify(name)
        };
      } else if (breadCrumbType === 'null') {
        return;
      } else {
        breadCrumb = merge(copy(breadCrumb), {
          title: breadCrumb.hasOwnProperty('title') ? breadCrumb.title : classify(name),
          path,
          linkable: breadCrumb.hasOwnProperty('linkable') ? breadCrumb.linkable : defaultLinkable
        });
      }

      return breadCrumb;
    });

    return emberArray(breadCrumbs.filter((breadCrumb) => typeOf(breadCrumb) !== 'undefined'));
  }
});
