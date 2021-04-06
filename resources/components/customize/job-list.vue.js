Vue.component('job-list', {
  data() {
    return {
      columns: [
        {
          title: 'Job Name',
          dataIndex: 'name',
          key: 'name',
          width: '40%',
        },
        {
          title: 'Start Time',
          dataIndex: 'startTime',
          key: 'startTime',
          scopedSlots: { customRender: 'startTime' },
          sorter: (a, b) => a.startTime - b.startTime,
        },
        {
          title: 'Duration',
          dataIndex: 'duration',
          key: 'duration',
          scopedSlots: { customRender: 'duration' },
          sorter: (a, b) => a.duration - b.duration,
        },
        {
          title: 'End Time',
          dataIndex: 'endTime',
          key: 'endTime',
          scopedSlots: { customRender: 'endTime' },
          sorter: (a, b) => a.endTime - b.endTime,
        },
        {
          title: 'Tasks',
          dataIndex: 'tasks',
          key: 'tasks',
          scopedSlots: { customRender: 'tasks' },
        },
        {
          title: 'Status',
          dataIndex: 'state',
          key: 'state',
          scopedSlots: { customRender: 'state' },
          sorter: (a, b) => a.state.length - b.state.length,
        },
      ],
    };
  },
  props: {
    jobs: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    title: {
      type: String,
      required: true,
      default: 'Job List',
    },
  },

  computed: {
    jobsData() {
      console.log('jobs', this.jobs);
      return this.jobs.map(job => ({
        ...job,
        key: job.jid,
      }));
    },
  },

  methods: {
    formatTimeStamp(timeStamp) {
      console.log('timestamp', timeStamp);
      const d = new Date(timeStamp);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const date = d.getDate();
      const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
      const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
      const seconds = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();

      const timeString = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
      return timeString;
    },
  },

  template: `
    <a-card class="job-list" :bordered="false" :title="title">
      <a-table :columns="columns" :data-source="jobsData" :pagination="false">
        <span slot="startTime" slot-scope="startTime">
          {{ formatTimeStamp(startTime) }}
        </span>
        <span slot="duration" slot-scope="duration">
          {{ duration + 'ms' }}
        </span>
        <span slot="endTime" slot-scope="endTime">
          {{ formatTimeStamp(endTime) }}
        </span>
        <span slot="tasks" slot-scope="tasks">
          <task-badge :tasks="tasks"></task-badge>
        </span>
        <span slot="state" slot-scope="state">
          <job-badge :state="state"></job-badge>
        </span>
      </a-table>  
    </a-card>
  `,
});
