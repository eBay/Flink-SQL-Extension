Vue.component('job-running', {
  data() {
    return {
      url: `${baseUrl}/#/job/running`,
    };
  },

  template: `
    <a-alert
      message="Page still Under Development"
      type="info"
      show-icon
    >
      <p slot="description">
        Job Running Page still under development, you can to <a :href="url">external page</a> for more details.
      </p>
    </a-alert>
  `,
});
