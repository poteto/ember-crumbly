export function initialize() {
  const application = arguments[1] || arguments[0];
  application.inject('component:bread-crumbs', 'applicationRoute', 'route:application');
}

export default {
  name: 'crumbly',
  initialize
};
