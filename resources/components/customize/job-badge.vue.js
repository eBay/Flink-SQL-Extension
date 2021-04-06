Vue.component('job-badge', {
  props: {
    state: {
      type: String,
      required: true,
    },
  },

  mounted() {
    console.log('job-badge', this.state)
  },

  computed: {
    getJobBadgeStyle() {
      return COLOR_MAP[this.state.toUpperCase()];
    },
  },

  template: `
    <div class="job-badge">
      <span :style="{ backgroundColor: getJobBadgeStyle }">{{ state }}</span>
    </div>
  `,
});
