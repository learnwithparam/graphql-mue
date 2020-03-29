/**
 * Node.js GraphQL API Starter Kit
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import { globalIdField } from 'graphql-relay';
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';

import { UserType } from '../users/types'
import { nodeInterface } from '../node';
import { dateField } from '../fields';
import { Context } from '../context';

export const HabitType = new GraphQLObjectType<any, Context, any>({
  name: 'Habit',
  interfaces: [nodeInterface],

  fields: () => ({
    id: globalIdField(),

    content: {
      type: new GraphQLNonNull(GraphQLString),
    },

    tags: {
      type: new GraphQLList(GraphQLString)
    },

    // Need to search it's causing circular reference
    // for our usecase we don't need to fetch all the habits only habits per user.
    createdBy: {
      type: UserType,
      resolve(self, args, ctx) {
        return ctx.userById.load(self.created_by);
      },
    },

    updatedBy: {
      type: UserType,
      resolve(self, args, ctx) {
        return ctx.userById.load(self.updated_by);
      },
    },


    createdAt: dateField((self: any) => self.created_at),
    updatedAt: dateField((self: any) => self.updated_at),
  }),
});
