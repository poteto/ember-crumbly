export function initialize(container, application) {
  application.inject('component:bread-crumbs', 'applicationRoute', 'route:application');
}

export default {
  name: 'crumbly',
  initialize
};
