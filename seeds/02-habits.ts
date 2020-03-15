import * as Knex from 'knex';
import faker from 'faker';
import { userIds } from './01-users';

const tags = [
  'javascript',
  'graphql',
  'nosql',
  'postgres',
  'mysql',
  'react',
  'node',
];

function getRandomizer(bottom, top) {
  return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
}

export async function seed(db: Knex): Promise<any> {
  const habits = Array.from({ length: 10 }).map(() => {
    const uuid = userIds[getRandomizer(0, 3)];
    return [
      faker.lorem.paragraph(),
      Array.from({ length: getRandomizer(1, 3) }).map(
        () => tags[getRandomizer(0, 5)],
      ),
      uuid,
      uuid,
    ];
  });
  await db.raw(
    `
      INSERT INTO habits (content, tags, created_by, updated_by)
      VALUES ${habits.map(() => '(?, ?, ?, ?)').join(', ')}
      ON CONFLICT DO NOTHING
    `,
    habits.reduce((acc, v) => [...acc, ...v], []),
  );
}
