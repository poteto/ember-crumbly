import Ember from 'ember';
import layout from '../templates/components/bread-crumbs';

const {
  get,
  Component,
  computed,
  copy,
  getWithDefault,
  assert,
  deprecate,
  inject,
  isPresent,
  typeOf,
  setProperties,
  getOwner,
  A: emberArray,
  String: { classify }
} = Ember;
const {
  bool,
  readOnly
} = computed;

export default Component.extend({
  routerService: inject.service('router'),
  layout,
  tagName: 'ol',
  linkable: true,
  reverse: false,
  classNameBindings: ['breadCrumbClass'],
  hasBlock: bool('template').readOnly(),
  currentUrl: readOnly('routerService.currentURL'),
  currentRouteName: readOnly('routerService.currentRouteName'),

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
    const routes = routeNames.slice(0, index + 1);

    if (routes.length === 1) {
      let path = `${name}.index`;

      return (this._lookupRoute(path)) ? path : name;
    }

    return routes.join('.');
  },

  _filterIndexAndLoadingRoutes(routeNames) {
    return routeNames.filter((name) => !(name === 'index' || name === 'loading'));
  },

  _lookupRoute(routeName) {
    return getOwner(this).lookup(`route:${routeName}`);
  },

  _lookupBreadCrumb(routeNames, filteredRouteNames) {
    const defaultLinkable = get(this, 'linkable');
    const pathLength = filteredRouteNames.length;
    const breadCrumbs = emberArray();

    filteredRouteNames.map((name, index) => {
      let path = this._guessRoutePath(routeNames, name, index);
      const route = this._lookupRoute(path);
      const isHead = index === 0;
      const isTail = index === pathLength - 1;

      const crumbLinkable = (index === pathLength - 1) ? false : defaultLinkable;

      assert(`[ember-crumbly] \`route:${path}\` was not found`, route);

      const multipleBreadCrumbs = route.get('breadCrumbs');

      if (multipleBreadCrumbs) {
        multipleBreadCrumbs.forEach((breadCrumb) => {
          breadCrumbs.pushObject(breadCrumb);
        });
      } else {
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

        breadCrumbs.pushObject(breadCrumb);
      }
    });

    return emberArray(breadCrumbs.filter((breadCrumb) => typeOf(breadCrumb) !== 'undefined'));
  }
});
