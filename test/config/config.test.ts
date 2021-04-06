import * as assert from 'assert';
import * as vscode from 'vscode';
import { getDashboardUrl, getClientStartCommand } from '../../src/config';

describe('Config test', () => {
  it('Flink SQL configuration should contains three configs', () => {
    const flinksqlConfig = vscode.workspace.getConfiguration('flinksql');
    assert.strictEqual(flinksqlConfig.has('dashboardUrl'), true);
    assert.strictEqual(flinksqlConfig.has('packagePath'), true);
    assert.strictEqual(flinksqlConfig.has('startClientCommand'), true);
  });

  it('Flink SQL configuration should return default values if declared', () => {
    assert.strictEqual(getDashboardUrl(), 'http://localhost:8081');
    assert.strictEqual(getClientStartCommand(), './bin/sql-client.sh embedded');
  });

  it('Flink SQL configuration should get updated when user update config as well', () => {
    const newDashboardUrl = 'http://localhost:3000';
    const flinksqlConfig = vscode.workspace.getConfiguration('flinksql');
    flinksqlConfig.update('dashboardUrl', newDashboardUrl).then(() => {
      assert.strictEqual(getDashboardUrl(), newDashboardUrl);
    });
  });
});
