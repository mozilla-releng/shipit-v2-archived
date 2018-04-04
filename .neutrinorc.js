const envs = {
  API_URL: 'https://shipit-workflow.staging.mozilla-releng.net',
  AUTH0_DOMAIN: 'auth.mozilla.auth0.com',
  AUTH0_CLIENT_ID: 'FK1mJkHhwjulTYBGklxn8W4Fhd1pgT4t',
};

// Set environment variables to their default values if not defined
Object.keys(envs).forEach(env => !(env in process.env) && (process.env[env] = envs[env]));

module.exports = {
  use: [
    [
      '@neutrinojs/airbnb',
      {eslint: {
        rules: {
            'react/jsx-filename-extension': [1, { 'extensions': ['.js'] }],
            'react/prop-types': 'off',
            'react/no-multi-comp': 'off',
          }
        }
      }
    ],
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'Ship-it!',
          mobile: true,
          meta: [
            {
              name: 'description',
              content: 'Web interface for starting and managing Firefox releases'
            },
            {
              name: 'author',
              content: 'Mozilla Release Engineering Team'
            }
          ]
        },
        devServer: { port: 8010, https: true },
      }
    ],
    ['@neutrinojs/env', Object.keys(envs)],
  ]
  // TODO: add source-map, see https://github.com/mozilla/firefox-code-coverage-frontend/commit/36f362f72667e2f309b43b23a84e6db14266b21a
};
