Vue.component('job-completed', {
  data() {
    return {
      url: `${baseUrl}/#/job/completed`,
    };
  },

  template: `
    <a-alert
      message="Page still Under Development"
      type="info"
      show-icon
    >
      <p slot="description">
        Job Completed Page still under development, you can to <a :href="url">external page</a> for more details.
      </p>
    </a-alert>
  `,
});
