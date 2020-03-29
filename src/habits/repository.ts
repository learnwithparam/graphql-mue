/* eslint-disable @typescript-eslint/camelcase */
import db from '../db';

const habits = db.table('habits');

export async function createHabit({ content, tags, createdBy, updatedBy }) {
  return habits.insert(
    {
      content,
      tags,
      created_by: createdBy,
      updated_by: updatedBy,
    },
    ['id', 'content', 'tags', 'created_by', 'updated_by'],
  );
}

export async function updateHabit({ id, content, tags, createdBy, updatedBy }) {
  return habits.where({ id }).update(
    {
      content,
      tags,
      created_by: createdBy,
      updated_by: updatedBy,
    },
    ['id', 'content', 'tags', 'created_by', 'updated_by'],
  );
}
