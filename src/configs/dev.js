module.exports = {
  API_URL: 'https://localhost:8015',
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
      appName: 'browser',
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
      // TODO: The actual appName is `mobile/android` but it gets the version from `browser`.
      appName: 'browser',
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
      appName: 'browser',
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
      product: 'thunderbird',
      prettyName: 'Thunderbird',
      appName: 'mail',
      branches: [
        {
          prettyName: 'Try',
          project: 'try-comm-central',
          branch: 'try-comm-central',
          repo: 'https://hg.mozilla.org/try-comm-central',
        },
      ],
      // TODO
      enablePartials: false,
      channel: 'beta',
    },
  ],
};

