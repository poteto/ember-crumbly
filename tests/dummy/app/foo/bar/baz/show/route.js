import Ember from 'ember';

const {
  Route,
  get,
  set
} = Ember;

export default Route.extend({
  breadCrumb: {},

  model() {
    return {
      name: 'Derek Zoolander',
      age: 21,
      look: 'Blue Steel'
    };
  },

  afterModel(model) {
    const name = get(model, 'name');
    const age = get(model, 'age');
    const look = get(model, 'look');

    const fashionModel = {
      title: name,
      age,
      look
    };

    set(this, 'breadCrumb', fashionModel);
  }
});
