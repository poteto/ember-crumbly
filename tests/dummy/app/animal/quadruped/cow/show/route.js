import Route from '@ember/routing/route';

export default Route.extend({
  breadCrumb: {
    name: 'Mary',
    age: 5,
    description: 'Mary is a lively cow that has been living in our zoo for the past 10 years.',
    linkable: false
  }
});
