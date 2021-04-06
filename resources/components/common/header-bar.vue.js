Vue.component('header-bar', {
  data() {
    return {
      flinkVersion: '',
      flinkCommit: '',
    };
  },

  methods: {
    reloadPage() {
      this.$vscode.postMessage({
        type: 'RELOAD',
      });
    },
  },

  mounted() {
    fetch(`${baseUrl}/overview`)
      .then(res => res.json())
      .then(data => {
        this.flinkVersion = data['flink-version'];
        this.flinkCommit = data['flink-commit'];
      });
  },

  template: `
    <a-layout-header class="header-bar">
      <a-icon type="reload" class="reload" @click="reloadPage" />
      <div class="right">
        <span>
          <strong>Version: </strong> {{ flinkVersion }}
        </span>
        <a-divider type="vertical" />
        <span>
          <strong>Commit: </strong> {{ flinkCommit }}
        </span>
        <a-divider type="vertical" />
        <span>
          <strong>Message: </strong>
          <a-badge count="0" show-zero />
        </span>
      </div>
    </a-layout-header>
  `,
});
