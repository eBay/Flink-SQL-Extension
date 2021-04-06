Vue.component('job-manager', {
  data() {
    return {
      url: `${baseUrl}/#/job/job-manager`,
    };
  },

  template: `
    <a-alert
      message="Page still Under Development"
      type="info"
      show-icon
    >
      <p slot="description">
        Job Manager Page still under development, you can to <a :href="url">external page</a> for more details.
      </p>
    </a-alert>
  `,
});
