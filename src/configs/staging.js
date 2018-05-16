module.exports = {
  API_URL: 'https://shipit-workflow.staging.mozilla-releng.net',
  TREEHERDER_URL: 'https://treeherder.mozilla.org',
  TASKCLUSTER_TOOLS_URL: 'https://tools.taskcluster.net',
  AUTH0: {
    domain: 'auth.mozilla.auth0.com',
    clientID: 'FK1mJkHhwjulTYBGklxn8W4Fhd1pgT4t',
    redirectUri: new URL('/login', window.location).href,
    scope: 'full-user-credentials openid profile email',
  },
  PRODUCTS: [
    {
      product: 'firefox',
      prettyName: 'Firefox Desktop',
      branches: [
        {
          prettyName: 'Maple Beta',
          project: 'maple',
          branch: 'projects/maple',
          repo: 'https://hg.mozilla.org/projects/maple',
        },
      ],
      enablePartials: true,
      channel: 'beta',
    },
    {
      product: 'fennec',
      prettyName: 'Firefox Moblie',
      branches: [
        {
          prettyName: 'Maple Beta',
          project: 'maple',
          branch: 'projects/maple',
          repo: 'https://hg.mozilla.org/projects/maple',
        },
      ],
      enablePartials: false,
      channel: 'beta',
    },
    {
      product: 'devedition',
      prettyName: 'Firefox Developer Edition',
      branches: [
        {
          prettyName: 'Maple Beta',
          project: 'maple',
          branch: 'projects/maple',
          repo: 'https://hg.mozilla.org/projects/maple',
        },
      ],
      enablePartials: true,
      channel: 'beta',
    },
  ],
};
