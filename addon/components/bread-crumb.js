import Ember from 'ember';
import layout from '../templates/components/bread-crumb';

const {
  Component,
  computed
} = Ember;
const {
  oneWay,
  bool
} = computed;

export default Component.extend({
  layout,
  tagName: 'li',
  classNameBindings: ['crumbClass'],
  i18n: false,

  crumbClass: oneWay('breadCrumbs.crumbClass'),
  linkClass: oneWay('breadCrumbs.linkClass'),
  hasBlock: bool('template').readOnly()
});
