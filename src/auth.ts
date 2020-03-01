import passport from 'passport';
import GitHubTokenStrategy from 'passport-github-token';
import { Request, Response } from 'express';
import { pathOr, compose, trim, split, last } from 'ramda';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// get authroziation from headers
const authorization = compose(
  trim,
  last,
  split(' '),
  pathOr('', ['headers', 'authorization']),
);

const authenticate = () => {
  const githubTokenStrategyCallback = (
    accessToken: string,
    refreshToken: string,
    profile: string,
    next,
  ): unknown => {
    // console.log(profile, 'profile');
    next(null, profile);
  };

  const strategy = new GitHubTokenStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      // callbackURL: `${APP_ORIGIN}/${GITHUB_CALLBACK_URL}`,
    },
    githubTokenStrategyCallback,
  );

  passport.use(strategy);

  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticateGithub: (req: Request, res: Response): Promise<object> => {
      //mutate
      req.query.access_token = authorization(req);

      return new Promise((resolve, reject) => {
        passport.authenticate(
          'github-token',
          { session: false },
          (err: any, data: any, info: any) => {
            if (err) reject(err);
            resolve({ data, info });
          },
        )(req, res);
      });
    },
  };
};

export default authenticate();
