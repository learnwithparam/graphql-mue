/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import { mutationWithClientMutationId } from 'graphql-relay';
import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';

import db from '../db';
import { InternalServerError } from '../errors';
import { HabitType } from '../types';
import { fromGlobalId } from '../utils';
import {
  createHabit as dbCreateHabit,
  updateHabit as dbUpdateHabit,
} from './repository';

export const createHabit = mutationWithClientMutationId({
  name: 'CreateHabit',
  description: 'Creates a habit.',

  inputFields: {
    content: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
  },

  outputFields: {
    habit: { type: HabitType },
  },

  async mutateAndGetPayload(input, ctx) {
    const user = await ctx.validateLogin();

    const isArray = tags => Array.isArray(tags) && tags.length;

    // Validate and sanitize user input
    const data = await ctx.validate(
      input,
      'create',
    )(x =>
      x
        .field('content')
        .isRequired()

        .field('tags')
        .is(isArray, 'Tags is required'),
    );

    try {
      const { content, tags } = data;
      const [habit] = await dbCreateHabit({
        content,
        tags,
        createdBy: user.id,
        updatedBy: user.id,
      });

      return { habit };
    } catch (err) {
      throw new InternalServerError(err.toString());
    }
  },
});

export const updateHabit = mutationWithClientMutationId({
  name: 'UpdateHabit',
  description: 'Updates a habit.',

  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
  },

  outputFields: {
    habit: { type: HabitType },
  },

  async mutateAndGetPayload(input, ctx) {
    const user = await ctx.validateLogin();

    const isArray = tags => Array.isArray(tags) && tags.length;
    const isUserOwnHabit = id => {
      return db
        .table('habits')
        .where({ id, created_by: user.id })
        .select(1)
        .then(x => x.length);
    };

    // Validate and sanitize user input
    const data = await ctx.validate(
      input,
      'create',
    )(x =>
      x
        .field('id', { as: 'id', trim: true })
        .is(isUserOwnHabit, 'You can only update your own habit')

        .field('content')
        .isRequired()

        .field('tags')
        .is(isArray, 'Tags is required'),
    );

    try {
      const { id, content, tags } = data;
      const [habit] = await dbUpdateHabit({
        id,
        content,
        tags,
        createdBy: user.id,
        updatedBy: user.id,
      });

      return { habit };
    } catch (err) {
      throw new InternalServerError(err.toString());
    }
  },
});
