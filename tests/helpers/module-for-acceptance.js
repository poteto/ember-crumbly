import {module} from 'qunit';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import {lookupComponent} from '../helpers/lookup';

export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();
      this.componentInstance = lookupComponent(this.application, 'bread-crumbs');
      if (options.beforeEach) {
        options.beforeEach.apply(this, arguments);
      }
    },

    afterEach() {
      destroyApp(this.application);
      this.componentInstance = null;
      if (options.afterEach) {
        options.afterEach.apply(this, arguments);
      }
    }
  });
}
