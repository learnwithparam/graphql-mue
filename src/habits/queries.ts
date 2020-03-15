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
    content: { type: new GraphQLNonNull(GraphQLString) },
  },

  async resolve(root, { id, content }, ctx) {
    let story = await db
      .table('habits')
      .where({ id })
      .first();

    // Attempts to find a story by partial ID contained in the slug.
    if (!story) {
      const match = content.match(/[a-f0-9]{7}$/);
      if (match) {
        story = await db
          .table('habits')
          .whereRaw(`content::text LIKE '%${match[0]}'`)
          .first();
      }
    }

    return story;
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
