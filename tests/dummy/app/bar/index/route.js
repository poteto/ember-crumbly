import Ember from 'ember';

const {
  Route
} = Ember;

export default Route.extend({
  breadCrumb: {
    title: 'I am Bar',
    path: 'foo.index'
  }
});
