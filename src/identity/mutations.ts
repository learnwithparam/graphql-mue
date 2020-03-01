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

import { handleSocialLogin } from '../utils';

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

    return ctx.validAccessToken(error, {
      accessToken,
      refreshToken,
      tokenType,
      scope,
    });
  },
});
