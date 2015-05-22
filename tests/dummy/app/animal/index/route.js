import Ember from 'ember';

const set = Ember.set;
const {
  Route
} = Ember;

export default Route.extend({
  breadCrumb: {
    name: 'Animals at the Zoo',
    description: 'Animals are multicellular, eukaryotic organisms of the kingdom Animalia (also called Metazoa).',
    linkable: false
  }
});
