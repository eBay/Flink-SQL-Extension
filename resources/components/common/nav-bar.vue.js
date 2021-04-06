Vue.component('nav-bar', {
  data() {
    return {
      collapsed: false,
      finkLogoPath: '',
      currentPage: currentPage,
    };
  },

  methods: {
    goToPage(route) {
      this.$vscode.postMessage({
        type: 'ROUTER',
        payload: route,
      });
    },
  },

  template: `
    <a-layout-sider v-model="collapsed" collapsible class="nav-bar">
      <div class="logo">
        <div>
          <h1 @click="() => goToPage('/overview')">Apache Flink Dashboard</h1>
        </div>
      </div>
      <a-menu theme="dark" :default-selected-keys="[currentPage]" mode="inline" :default-open-keys="['jobs']">
        <a-menu-item key="overview" @click="() => goToPage('/overview')">
          <a-icon type="dashboard" />
          <span>
            Overview
          </span>
        </a-menu-item>
        <a-sub-menu key="jobs">
          <span slot="title"><a-icon type="bars" /><span>Jobs</span></span>
          <a-menu-item key="job-running" @click="() => goToPage('/job/running')">
            Running Jobs
          </a-menu-item>
          <a-menu-item key="job-completed" @click="() => goToPage('/job/completed')">
            Completed Jobs
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="task-manager" @click="() => goToPage('/task-manager')">
          <a-icon type="schedule" />
          <span>Task Managers</span>
        </a-menu-item>
        <a-menu-item key="job-manager" @click="() => goToPage('/job/job-manager')">
          <a-icon type="build" />
          <span>Job Manager</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
  `,
});
