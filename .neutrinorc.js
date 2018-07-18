const envs = {
  CONFIG: 'staging',
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
            'no-console': 'off',
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
        devServer: {
          port: process.env.PORT || 8010,
          https: !Boolean(process.env.HTTPS_DISABLED),
          disableHostCheck: true,
          historyApiFallback: {
            rewrites: [
              { from: '__heartbeat__', to: 'views/ok.html' },
              { from: '__lbheartbeat__', to: 'views/ok.html' },
              { from: '__version__', to: 'views/version.json' },
            ],
          },
        },
      }
    ],
    ['@neutrinojs/env', Object.keys(envs)],
  ]
  // TODO: add source-map, see https://github.com/mozilla/firefox-code-coverage-frontend/commit/36f362f72667e2f309b43b23a84e6db14266b21a
};
