import Route from '@ember/routing/route';
import { set, get } from '@ember/object';

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
