import Ember from 'ember';
import layout from '../templates/components/bread-crumb';

const {
  get,
  set,
  computed,
  Component
} = Ember;
const {
  oneWay,
  bool
} = computed;

export default Component.extend({
  layout,
  tagName: 'li',
  classNameBindings: ['crumbClass'],
  attributeBindings: [],

  crumbClass: oneWay('breadCrumbs.crumbClass'),
  linkClass: oneWay('breadCrumbs.linkClass'),
  hasSchema: oneWay('breadCrumbs.hasSchema'),
  hasBlock: bool('template').readOnly(),
  itemscope: true,
  itemtype: 'http://schema.org/ListItem',
  itemprop: 'itemListElement',

  position: computed('index', function() {
    return Number(this.get('index') + 1);
  }).readOnly(),

  init() {
    this._super(...arguments);
    const hasSchema = get(this, 'breadCrumbs.hasSchema');

    if (hasSchema) {
      const newAttributeBindings = ['itemprop', 'itemscope', 'itemtype'];

      set(this, 'attributeBindings', this.attributeBindings.concat(newAttributeBindings));
    }
  }
});
