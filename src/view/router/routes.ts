// use const assertion to get string literal
// see: https://stackoverflow.com/a/53662389/12733140
export const routes = {
  '/overview': 'overview',
  '/job/running': 'job-running',
  '/job/completed': 'job-completed',
  '/task-manager': 'task-manager',
  '/job/job-manager': 'job-manager',
} as const;
