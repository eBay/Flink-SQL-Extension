Vue.component('overview-static', {
  props: {
    slotsAvailable: {
      type: Number,
      default: 0,
      required: true,
    },
    slotsTotal: {
      type: Number,
      default: 0,
      required: true,
    },
    jobsRunning: {
      type: Number,
      default: 0,
      required: true,
    },
    jobsFinished: {
      type: Number,
      default: 0,
      required: true,
    },
    jobsCancelled: {
      type: Number,
      default: 0,
      required: true,
    },
    jobsFailed: {
      type: Number,
      default: 0,
      required: true,
    },
    taskManagers: {
      type: Number,
      default: 0,
      required: true,
    },
  },

  template: `
    <a-row class="overview-static" :gutter="24">
      <a-col :span="12" class="col">
        <a-card :bordered="false" title="Available Task Slots">
          <div class="total">{{ slotsAvailable }}</div>
          <div class="footer">
            <div class="field">
              <span>Total Task Slots</span>
              <span>{{ slotsTotal }}</span>
            </div>
            <a-divider type="vertical"></a-divider>
            <div class="field">
              <span>Task Managers</span>
              <span>{{ taskManagers }}</span>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="12" class="col">
        <a-card :bordered="false" title="Running Jobs">
          <div class="total">{{ jobsRunning }}</div>
          <div class="footer">
            <div class="field">
              <span>Finished</span>
              <span>{{ jobsFinished }}</span>
            </div>
            <a-divider type="vertical"></a-divider>
            <div class="field">
              <span>Canceled</span>
              <span>{{ jobsCancelled }}</span>
            </div>
            <a-divider type="vertical"></a-divider>
            <div class="field">
              <span>Failed</span>
              <span>{{ jobsFailed }}</span>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  `,
});

Vue.component('overview', {
  data() {
    return {
      overview: {
        slotsAvailable: 0,
        slotsTotal: 0,
        jobsRunning: 0,
        jobsFinished: 0,
        jobsCancelled: 0,
        jobsFailed: 0,
        taskManagers: 0,
      },
      completedJobs: [],
      runningJobs: [],
    };
  },

  mounted() {
    fetch(`${baseUrl}/overview`)
      .then(res => res.json())
      .then(data => {
        this.overview.slotsAvailable = data['slots-available'];
        this.overview.slotsTotal = data['slots-total'];
        this.overview.jobsRunning = data['jobs-running'];
        this.overview.jobsFinished = data['jobs-finished'];
        this.overview.jobsCancelled = data['jobs-cancelled'];
        this.overview.jobsFailed = data['jobs-failed'];
        this.overview.taskManagers = data['taskmanagers'];
      });

    fetch(`${baseUrl}/jobs/overview`)
      .then(res => res.json())
      .then(data => {
        const jobs = data.jobs.map(job => ({
          jid: job.jid,
          name: job.name,
          state: job.state,
          startTime: job['start-time'],
          endTime: job['end-time'],
          duration: job.duration,
          lastModification: job['last-modification'],
          tasks: job.tasks,
        }));
        this.completedJobs = jobs.filter(j => JOB_COMPLETED.includes(j.state));
        this.runningJobs = jobs.filter(j => !JOB_COMPLETED.includes(j.state));
      });
  },

  template: `
    <div>
      <overview-static v-bind="overview"></overview-static>
      <job-list :jobs="runningJobs" title="Running Job List"></job-list>
      <job-list :jobs="completedJobs" title="Completed Job List"></job-list>
    </div>
  `,
});
