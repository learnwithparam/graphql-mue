/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import { mutationWithClientMutationId } from 'graphql-relay';
import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLEnumType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import { InternalServerError } from '../errors';
import { handleSocialLogin } from '../utils';
import { UserType } from '../users/types';
import { registerUser } from '../users/repository';

import { ProviderType } from './types';

export const socialLoginCallback = mutationWithClientMutationId({
  name: 'SocialLoginCallback',
  description: 'Generate access token for users base of different social login',

  inputFields: {
    code: { type: GraphQLString },
    provider: {
      type: ProviderType,
    },
  },

  outputFields: {
    accessToken: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
    tokenType: { type: GraphQLString },
    scope: { type: GraphQLString },
  },

  async mutateAndGetPayload(input, ctx) {
    // Validate and sanitize user input
    const data = await ctx.validate(
      input,
      'update',
    )(x =>
      x
        .field('code', { as: 'code' })
        .isLength({ min: 10 })

        .field('provider', { as: 'provider' })
        .isLength({ min: 3 }),
    );

    if (input.validateOnly) {
      return { accessToken: null, refreshToken: null };
    }

    const request = handleSocialLogin(data.provider);

    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: tokenType,
      scope,
      error,
    } = await request({
      method: 'post',
      body: {
        code: data.code,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    //

    return ctx.validAccessToken(error, {
      accessToken,
      refreshToken,
      tokenType,
      scope,
    });
  },
});

export const authenticateSocialLogin = mutationWithClientMutationId({
  name: 'AuthenticateSocialLogin',
  description:
    'Authenticate user using access token provided from calling callback and upsert identity.',

  inputFields: {
    provider: {
      type: ProviderType,
    },
  },

  outputFields: {
    user: {
      type: UserType,
    },
  },

  async mutateAndGetPayload(input, ctx) {
    // Validate and sanitize user input
    const data = await ctx.validate(
      input,
      'update',
    )(x => x.field('provider', { as: 'provider' }).isLength({ min: 3 }));

    if (input.validateOnly) {
      return { accessToken: null, refreshToken: null };
    }

    const parsedToken = await ctx.validateLogin();
    const {
      data: { username, displayName, _json },
    } = parsedToken;
    const { id, html_url: htmlUrl, avatar_url: avatarUrl, email } = _json;

    try {
      const user = await registerUser({
        user: {
          username: username,
          email,
          display_name: displayName,
          photo_url: avatarUrl,
        },
        identity: {
          provider_id: id,
          profile_url: htmlUrl,
          provider: input.provider,
        },
      });

      return {
        user,
      };
    } catch (err) {
      console.log(err.toString());
      throw new InternalServerError(err.toString());
    }
  },
});
