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

const githubTokenStrategyCallback = (
  accessToken: string,
  refreshToken: string,
  profile: string,
  next,
): unknown => {
  // needs to create here a field transformer to have consistent return of data we need.
  next(null, profile);
};
const authenticateGithub = (req: Request, res: Response): Promise<object> => {
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
};

const authenticate = () => {
  const strategy = new GitHubTokenStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
    },
    githubTokenStrategyCallback,
  );

  passport.use(strategy);

  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticate: (req: Request, res: Response): Promise<object> => {
      // github || google || facebook || userpass.
      return authenticateGithub(req, res);
    },
    authenticateGithub,
  };
};

export default authenticate();
