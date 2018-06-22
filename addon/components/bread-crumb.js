import Component from '@ember/component';
import layout from '../templates/components/bread-crumb';

const {
  oneWay,
  bool
} = computed;

export default Component.extend({
  layout,
  tagName: 'li',
  classNameBindings: ['crumbClass'],

  crumbClass: oneWay('breadCrumbs.crumbClass'),
  linkClass: oneWay('breadCrumbs.linkClass'),
  hasBlock: bool('template').readOnly()
});
