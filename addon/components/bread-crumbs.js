import Ember from 'ember';
import layout from '../templates/components/bread-crumbs';
import computed from 'ember-new-computed';
import getOwner from 'ember-getowner-polyfill';

const {
  get,
  Component,
  getWithDefault,
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
  router: readOnly('applicationRoute.router'),
  currentPath: readOnly('applicationRoute.controller.currentPath'),
  currentRouteName: readOnly('applicationRoute.controller.currentRouteName'),

  handlerInfos: computed('currentRouteName', {
    get() {
      return this.get('router').router.currentHandlerInfos;
    }
  }),

  pathNames: computed('handlerInfos.[]', {
    get() {
      return this.get('handlerInfos').map((handlerInfo) => handlerInfo.name);
    }
  }),

  routeHierarchy: computed('currentUrl', 'pathNames', 'reverse', {
    get() {
      const pathNames = this.get('pathNames');
      const currentPath = getWithDefault(this, 'currentPath', false);
      const routeNames = pathNames.filter((path) => currentPath.indexOf(path) > -1);
      const filteredRouteNames = routeNames.filter((path) => path.indexOf('index') === -1);
      const indexRoute = routeNames.filter((path) => path.indexOf('index') > -1)[0];

      const crumbs = this._lookupBreadCrumb(filteredRouteNames, indexRoute);
      return get(this, 'reverse') ? crumbs.reverse() : crumbs;
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

  _guessRoutePath(routeNames, name, index) {
    const routes = routeNames.slice(0, index + 1);

    if (routes.length === 1) {
      let path = `${name}.index`;

      return (this._lookupRoute(path)) ? path : name;
    }

    return routes[index];
  },

  _lookupRoute(routeName) {
    return getOwner(this).lookup(`route:${routeName}`);
  },

  _lookupBreadCrumb(routeNames, indexRoute) {
    const defaultLinkable = get(this, 'linkable');
    const routesLength = routeNames.length;
    const breadCrumbs = routeNames.map((path, index) => {
      const isLastRoute = index === routesLength-1;

      if (!!indexRoute && isLastRoute) { 
		path = indexRoute; 
	  }

      const route = this._lookupRoute(path);

      const crumbLinkable = isLastroute ? false : defaultLinkable;
      const isHead = index === 0;
      const isTail = isLastRoute;

      let breadCrumb = getWithDefault(route, 'breadCrumb', {
        title: classify(name)
      });

      if (typeOf(breadCrumb) === 'null') {
        return;
      } else {
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
