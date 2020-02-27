import { request } from './request';

const SOCIAL_LOGIN_PROPS = {
  GITHUB: {
    url: 'https://github.com/login/oauth/access_token',
    data: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: process.env.GITHUB_CLIENT_ID,
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_secret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
};

export const handleSocialLogin = (provider: string) => ({
  body,
  ...options
}) => {
  const { url, data } = SOCIAL_LOGIN_PROPS[provider];
  return request(url, {
    ...options,
    body: JSON.stringify({
      ...body,
      ...data,
    }),
  });
};
