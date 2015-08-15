import Ember from 'ember';
import layout from '../templates/components/bread-crumb';

const {
  Component,
  computed
} = Ember;

export default Component.extend({
  layout,
  tagName: 'li',
  classNameBindings: [ 'crumbClass' ],

  crumbClass: computed.oneWay('breadCrumbs.crumbClass'),
  linkClass: computed.oneWay('breadCrumbs.linkClass'),
  hasBlock: computed.bool('template').readOnly()
});
