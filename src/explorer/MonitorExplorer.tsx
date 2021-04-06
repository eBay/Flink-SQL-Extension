import * as vscode from 'vscode';
import * as path from 'path';
import React, { useCallback, useEffect, useState } from 'react';
import ReactTreeView, { TreeItem, ExtendedTreeItem } from 'react-vsc-treeview';
import axios, { AxiosError } from 'axios';
import { getDashboardUrl } from '../config';
import { refreshJobsEvent, refreshTaskManagersEvent } from '../events/explorerEvents';

type TaskManager = {
  id: string;
  path: string;
  timeSinceLastHeartbeat: number;
  slotsNumber: number;
  freeSlots: number;
  hardware: {
    cpuCores: number;
    physicalMemory: number;
    freeMemory: number;
    managedMemory: number;
  };
};

type JobState =
  | 'CREATED'
  | 'RUNNING'
  | 'FAILING'
  | 'FAILED'
  | 'CANCELLING'
  | 'CANCELED'
  | 'FINISHED'
  | 'RESTARTING'
  | 'SUSPENDED';

type Job = {
  jid: string;
  name: string;
  state: JobState;
  'start-time': number;
  'end-time': number;
  duration: number;
  'last-modification': number;
  tasks: {
    total: number;
    created: number;
    scheduled: number;
    deploying: number;
    running: number;
    finished: number;
    canceling: number;
    canceled: number;
    failed: number;
    reconciling: number;
  };
};

type MonitorExplorerProps = {
  context: vscode.ExtensionContext;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const MonitorExplorer: React.FC<MonitorExplorerProps> = ({ context }) => {
  const dashboardUrl = getDashboardUrl();
  const [taskManagers, setTaskManagers] = useState<TaskManager[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  // Note: use context.extensionPath to reference resources in extension
  const baseIconPath = path.join(context.extensionPath, 'images');

  const getJobIconPath = (jobState: JobState) => {
    const statusIconPath = path.join(baseIconPath, 'status');
    switch (jobState) {
      case 'CANCELED':
        return path.join(statusIconPath, 'canceled.svg');
      case 'CANCELLING':
        return path.join(statusIconPath, 'canceling.svg');
      case 'CREATED':
        return path.join(statusIconPath, 'created.svg');
      case 'FAILING':
      case 'FAILED':
        return path.join(statusIconPath, 'failed.svg');
      case 'FINISHED':
        return path.join(statusIconPath, 'finished.svg');
      case 'RESTARTING':
        return path.join(statusIconPath, 'restarting.svg');
      case 'RUNNING':
        return path.join(statusIconPath, 'running.svg');
      case 'SUSPENDED':
        return path.join(statusIconPath, 'in-progress.svg');
      default:
        return '';
    }
  };

  // TODO: might want to change it to long polling, see: https://stackoverflow.com/a/63134447/12733140
  const fetchTaskManagers = useCallback(() => {
    axios
      .get<{ taskmanagers: TaskManager[] }>(`${dashboardUrl}/taskmanagers`)
      .then(res => {
        setTaskManagers(res.data.taskmanagers);
      })
      .catch((error: AxiosError) => {
        vscode.window.showErrorMessage(`Encountered errors when fetching task managers: ${error.response?.data}.`);
      });
  }, [dashboardUrl]);

  const fetchJobs = useCallback(() => {
    axios
      .get<{ jobs: Job[] }>(`${dashboardUrl}/jobs/overview`)
      .then(res => {
        setJobs(res.data.jobs);
      })
      .catch((error: AxiosError) => {
        vscode.window.showErrorMessage(`Encountered errors when fetching jobs: ${error.response?.data}`);
      });
  }, [dashboardUrl]);

  useEffect(() => {
    fetchTaskManagers();
  }, [fetchTaskManagers]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    // resend request when refreshJobsEvent get fired
    const disposable = refreshJobsEvent.event(() => {
      fetchJobs();
    });

    return () => {
      disposable.dispose();
    };
  }, [fetchJobs]);

  useEffect(() => {
    // resend request when refreshTaskManagersEvent get fired
    const disposable = refreshTaskManagersEvent.event(() => {
      fetchTaskManagers();
    });

    return () => {
      disposable.dispose();
    };
  }, [fetchTaskManagers]);

  return (
    <>
      <TreeItem label="Task Managers" expanded={true} tooltip="Task Managers" contextValue="taskManagers">
        {taskManagers.map(taskManager => (
          <TreeItem
            tooltip={`Task Manager: ${taskManager.id}`}
            label={taskManager.id}
            key={taskManager.id}
            iconPath={{
              light: path.join(baseIconPath, 'calendar-light.svg'),
              dark: path.join(baseIconPath, 'calendar-dark.svg'),
            }}
            contextValue="taskManager"
          />
        ))}
      </TreeItem>
      <TreeItem label="Jobs" expanded={true} tooltip="Jobs" contextValue="jobs">
        {jobs.map(job => (
          <TreeItem
            tooltip={`Job: ${job.name}`}
            label={job.jid}
            key={job.jid}
            iconPath={getJobIconPath(job.state)}
            contextValue="job"
          />
        ))}
      </TreeItem>
    </>
  );
};

export const openExternalView = (node?: ExtendedTreeItem) => {
  const dashboardUrl = getDashboardUrl();

  if (node === undefined) {
    // if node is undefined, open full external webview instead
    vscode.env.openExternal(vscode.Uri.parse(dashboardUrl));
    return;
  }

  const { label, contextValue } = node?.value;
  if (contextValue === 'taskManagers') {
    vscode.env.openExternal(vscode.Uri.parse(`${dashboardUrl}/#/task-manager`));
  } else if (contextValue === 'taskManager') {
    vscode.env.openExternal(vscode.Uri.parse(`${dashboardUrl}/#/task-manager/${label}/metrics`));
  } else if (contextValue === 'jobs') {
    vscode.env.openExternal(vscode.Uri.parse(`${dashboardUrl}/#/overview`));
  } else if (contextValue === 'job') {
    vscode.env.openExternal(vscode.Uri.parse(`${dashboardUrl}/#/job/${label}/overview`));
  } else {
    vscode.window.showErrorMessage(`Can not open external view for ${label}`);
  }
};

export const renderMonitorExplorer = (context: vscode.ExtensionContext) => {
  const monitorExplorer = ReactTreeView.render(<MonitorExplorer context={context} />, 'flinksqlMonitor');
  return monitorExplorer;
};
