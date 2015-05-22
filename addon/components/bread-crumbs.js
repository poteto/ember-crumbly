import Ember from 'ember';
import layout from '../templates/components/bread-crumbs';

const get = Ember.get;
const {
  EnumerableUtils,
  Component,
  Logger,
  computed,
  getWithDefault,
  assert,
  typeOf
} = Ember;

const {
  map,
  filter
} = EnumerableUtils;

const {
  warn
} = Logger;

export default Component.extend({
  layout: layout,
  outputStyle: 'bootstrap',
  linkable: true,
  currentRouteName: computed.alias('applicationController.currentRouteName'),

  routeHierarchy: computed('currentRouteName', {
    get() {
      const container = get(this, 'container');
      const currentRouteName = getWithDefault(this, 'currentRouteName', '');

      if (currentRouteName === '') {
        warn('No current route found');
      }

      const routeNames = this._splitCurrentRouteName(currentRouteName);
      const filteredRouteNames = this._filterIndexRoutes(routeNames);

      return this._lookupBreadCrumb(routeNames, filteredRouteNames, container);
    },

    set() {
      warn('`routeHierarchy` is read only');
    }
  }),

  _splitCurrentRouteName(currentRouteName) {
    return currentRouteName.split('.');
  },

  _filterIndexRoutes(routeNames) {
    return filter(routeNames, (name) => {
      return name !== 'index';
    });
  },

  _lookupBreadCrumb(routeNames, filteredRouteNames, container) {
    const breadCrumbs = map(filteredRouteNames, (name, index) => {
      let path;
      let breadCrumb;
      const routes = routeNames.slice(0, index + 1);

      if (routes.length === 1) {
        path = `${name}.index`;
      } else {
        path = routes.join('.');
      }

      const routeObject = container.lookup(`route:${path}`);
      assert(`\`route:${path}\` was not found`, routeObject);

      breadCrumb = routeObject.getWithDefault('breadCrumb', {});
      const breadCrumbType = typeOf(breadCrumb);

      if (breadCrumbType === 'null') {
        return;
      } else {
        breadCrumb.path = path;
      }

      return breadCrumb;
    });

    return filter(breadCrumbs, (breadCrumb) => {
      return typeOf(breadCrumb) !== 'undefined';
    });
  }
});
