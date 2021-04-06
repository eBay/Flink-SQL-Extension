Vue.component('task-badge', {
  props: {
    tasks: {
      type: Object,
      required: true,
      default() {
        return {
          total: 0,
          created: 0,
          scheduled: 0,
          deploying: 0,
          running: 0,
          finished: 0,
          canceling: 0,
          canceled: 0,
          failed: 0,
          reconciling: 0,
        };
      },
    },
  },

  mounted() {
    console.log('props', this.tasks);
  },

  computed: {
    displayedTasks() {
      return Object.entries(this.tasks).reduce((result, [task, taskValue]) => {
        if (taskValue) {
          result[task] = taskValue;
        }
        return result;
      }, {});
    },
  },

  methods: {
    getTaskBadgeStyle(task) {
      return COLOR_MAP[task.toUpperCase()];
    },
  },

  template: `
    <div class="task-badge">
      <a-tooltip v-for="(taskValue, task) in displayedTasks" :key="task" :title="task.toUpperCase()">
        <span :style="{ backgroundColor: getTaskBadgeStyle(task) }">
          {{ taskValue }}
        </span>
      </a-tooltip>
    </div>
  `,
});
