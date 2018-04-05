export const AUTH_CONFIG = {
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  redirectUri: new URL('/login', window.location).href,
  scope: 'full-user-credentials openid profile email',
};
export const TREEHERDER_URL = 'https://treeherder.mozilla.org';
export const TASKCLUSTER_TOOLS_URL = 'https://tools.taskcluster.net';
export const { API_URL } = process.env;
