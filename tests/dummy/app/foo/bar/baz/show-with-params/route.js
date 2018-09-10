import Route from '@ember/routing/route';
import { set, get } from '@ember/object';

export default Route.extend({
  breadCrumb: {},

  model(params) {
    let models = [
      { name: 'Derek Zoolander' },
      { name: 'Hansel McDonald' }
    ];

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    return models[(params.model_id - 1)];
    // jscs:enable
  },

  afterModel(model) {
    const name = get(model, 'name');

    const fashionModel = {
      title: name
    };

    set(this, 'breadCrumb', fashionModel);
  }
});
