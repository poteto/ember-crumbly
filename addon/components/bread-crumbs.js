import Ember from 'ember';
import layout from '../templates/components/bread-crumbs';

const get = Ember.get;
const {
  A: emberArray,
  EnumerableUtils,
  Component,
  Logger,
  computed,
  getWithDefault,
  assert,
  typeOf,
  setProperties
} = Ember;

const {
  classify
} = Ember.String;

const {
  map,
  filter
} = EnumerableUtils;

const {
  warn
} = Logger;

export default Component.extend({
  layout,
  tagName: 'ol',
  linkable: true,
  reverse: false,
  classNameBindings: [ 'breadCrumbClass' ],
  hasBlock: computed.bool('template').readOnly(),
  currentRouteName: computed.readOnly('applicationController.currentRouteName'),

  routeHierarchy: computed('currentRouteName', 'reverse', {
    get() {
      const currentRouteName = getWithDefault(this, 'currentRouteName', false);

      assert('[ember-crumbly] Could not find a curent route', currentRouteName);

      const routeNames = this._splitCurrentRouteName(currentRouteName);
      const filteredRouteNames = this._filterIndexRoutes(routeNames);

      const crumbs = this._lookupBreadCrumb(routeNames, filteredRouteNames);
      return this.get('reverse') ? crumbs.reverse() : crumbs;
    },

    set() {
      warn('[ember-crumbly] `routeHierarchy` is read only');
    }
  }),

  breadCrumbClass: computed('outputStyle', {
    get() {
      let className = 'breadcrumb';
      const outputStyle = getWithDefault(this, 'outputStyle', '');
      const lowerCaseOutputStyle = outputStyle.toLowerCase();

      if (lowerCaseOutputStyle === 'foundation') {
        className = 'breadcrumbs';
      }

      return className;
    },

    set() {
      warn('[ember-crumbly] `breadCrumbClass` is read only');
    }
  }),

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
    return filter(routeNames, (name) => {
      return name !== 'index';
    });
  },

  _lookupRoute(routeName) {
    const container = get(this, 'container');
    const route = container.lookup(`route:${routeName}`);
    assert(`[ember-crumbly] \`route:${routeName}\` was not found`, route);

    return route;
  },

  _lookupBreadCrumb(routeNames, filteredRouteNames) {
    const defaultLinkable = get(this, 'linkable');
    const breadCrumbs = map(filteredRouteNames, (name, index) => {
      const path = this._guessRoutePath(routeNames, name, index);
      let breadCrumb = this._lookupRoute(path).getWithDefault('breadCrumb', undefined);
      const breadCrumbType = typeOf(breadCrumb);

      if (breadCrumbType === 'undefined') {
        breadCrumb = {
          path,
          linkable: defaultLinkable,
          title: classify(name)
        };
      } else if (breadCrumbType === 'null') {
        return;
      } else {
        setProperties(breadCrumb, {
          path,
          linkable: breadCrumb.hasOwnProperty('linkable') ? breadCrumb.linkable : defaultLinkable
        });
      }

      return breadCrumb;
    });

    return emberArray(filter(breadCrumbs, (breadCrumb) => {
      return typeOf(breadCrumb) !== 'undefined';
    }));
  }
});
