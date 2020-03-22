/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';

import db from '../db';
import { HabitType } from './types';

export const habit = {
  type: HabitType,

  args: {
    id: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(root, { id }, ctx) {
    await ctx.validateLogin();
    return ctx.habitsById.load(id);
  },
};

export const habits = {
  type: new GraphQLList(HabitType),

  resolve(self, args, ctx) {
    return db
      .table('habits')
      .orderBy('created_at', 'desc')
      .limit(100)
      .select();
  },
};
