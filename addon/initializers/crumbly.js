export function initialize(container, application) {
  application.inject('component:bread-crumbs', 'applicationController', 'controller:application');
}

export default {
  name: 'crumbly',
  initialize: initialize
};
