import * as assert from 'assert';
import { Router } from '../../src/view/router/Router';

describe('Router test', () => {
  let router: Router;
  beforeEach(() => {
    // https://stackoverflow.com/a/59974664/12733140
    router = new Router();
  });

  it('initial route should be /overview', () => {
    assert.strictEqual(router.getCurrentRoute(), '/overview');
  });

  it('initial page should be overview', () => {
    assert.strictEqual(router.getCurrentPage(), 'overview');
  });

  it('change route should affect current route and page', () => {
    router.route('/task-manager');
    assert.strictEqual(router.getCurrentRoute(), '/task-manager');
    assert.strictEqual(router.getCurrentPage(), 'task-manager');
  });

  it('rest route should go back to overview page', () => {
    router.route('/task-manager');
    assert.strictEqual(router.getCurrentRoute(), '/task-manager');
    assert.strictEqual(router.getCurrentPage(), 'task-manager');
    router.reset();
    assert.strictEqual(router.getCurrentRoute(), '/overview');
    assert.strictEqual(router.getCurrentPage(), 'overview');
  });
});
