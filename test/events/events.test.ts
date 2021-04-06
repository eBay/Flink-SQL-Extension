import * as assert from 'assert';
import { refreshJobsEvent, refreshTaskManagersEvent } from '../../src/events/explorerEvents';

describe('Events test', () => {
  refreshTaskManagersEvent.event(() => {
    assert.ok(true);
  });
  refreshJobsEvent.event(() => {
    assert.ok(true);
  });
  refreshTaskManagersEvent.fire();
  refreshJobsEvent.fire();
});
