import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Request, Response } from 'express';

const APP_ORIGIN = process.env.APP_ORIGIN;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

const authenticate = () => {
  const githubTokenStrategyCallback = (
    accessToken: string,
    refreshToken: string,
    profile: string,
    done: (
      err: null,
      value: { accessToken: string, refreshToken: string, profile: string },
    ) => unknown,
  ): unknown =>
    done(null, {
      accessToken,
      refreshToken,
      profile,
    });

  const strategy = new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: `${APP_ORIGIN}/${GITHUB_CALLBACK_URL}`,
    },
    githubTokenStrategyCallback,
  );

  passport.use(strategy);

  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticateGithub: (req: Request, res: Response): Promise<object> =>
      new Promise((resolve, reject) => {
        passport.authenticate(
          'google-token',
          { session: false },
          (err: any, data: any, info: any) => {
            if (err) reject(err);
            resolve({ data, info });
          },
        )(req, res);
      }),
  };
};

export default authenticate();
