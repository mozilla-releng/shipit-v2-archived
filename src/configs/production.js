module.exports = {
  API_URL: 'https://shipit-workflow.mozilla-releng.net',
  TREEHERDER_URL: 'https://treeherder.mozilla.org',
  TASKCLUSTER_TOOLS_URL: 'https://tools.taskcluster.net',
  AUTH0: {
    domain: 'auth.mozilla.auth0.com',
    clientID: 'TODO',
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
          prettyName: 'Beta',
          project: 'mozilla-beta',
          branch: 'releases/mozilla-beta',
          repo: 'https://hg.mozilla.org/releases/mozilla-beta',
        },
        {
          prettyName: 'Release',
          project: 'mozilla-release',
          branch: 'releases/mozilla-release',
          repo: 'https://hg.mozilla.org/releases/mozilla-release',
        },
        {
          prettyName: 'ESR60',
          project: 'mozilla-esr60',
          branch: 'releases/mozilla-esr60',
          repo: 'https://hg.mozilla.org/releases/mozilla-esr60',
        },
      ],
      enablePartials: true,
    },
    {
      product: 'fennec',
      prettyName: 'Firefox Moblie',
      // TODO: The actual appName is `mobile/android` but it gets the version from `browser`.
      appName: 'browser',
      branches: [
        {
          prettyName: 'Beta',
          project: 'mozilla-beta',
          branch: 'releases/mozilla-beta',
          repo: 'https://hg.mozilla.org/releases/mozilla-beta',
        },
        {
          prettyName: 'Release',
          project: 'mozilla-release',
          branch: 'releases/mozilla-release',
          repo: 'https://hg.mozilla.org/releases/mozilla-release',
        },
      ],
      enablePartials: false,
    },
    {
      product: 'devedition',
      prettyName: 'Firefox Developer Edition',
      appName: 'browser',
      branches: [
        {
          prettyName: 'Beta',
          project: 'mozilla-beta',
          branch: 'releases/mozilla-beta',
          repo: 'https://hg.mozilla.org/releases/mozilla-beta',
        },
      ],
      enablePartials: true,
    },
  ],
};
