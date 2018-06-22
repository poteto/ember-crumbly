import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('foo', function() {
    this.route('bar', function() {
      this.route('baz', function() {
        this.route('hidden');
        this.route('show');
        this.route('show-with-params', { path: '/:model_id' });
      });
    });
  });
  this.route('bar', function() {
    this.route('baz');
  });

  this.route('animal', function() {
    this.route('quadruped', function() {
      this.route('cow', function() {
        this.route('hidden');
        this.route('show');
      });
    });
  });

  this.route('dessert', function() {
    this.route('cookie');
  });

  this.route('about');
});

export default Router;
