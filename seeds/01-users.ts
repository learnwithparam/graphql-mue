/**
 * Test data set (run `yarn db-seed --env=?`)
 * https://knexjs.org/#Seeds-API
 * https://github.com/kriasoft/nodejs-api-starter
 * Copyright © 2016-present Kriasoft | MIT License
 */

import Knex from 'knex';
import faker from 'faker';

export const userIds = [
  '39dcde60-c4f4-4dd6-989e-0e68ecbe06af',
  '0553b8c0-e70f-491a-8be0-6e848b8e3712',
  '35422957-603b-4d3b-85f5-3e742408b8de',
  'af4c527d-f63b-45c5-81e3-e635e4c84d7a',
];

export async function seed(db: Knex): Promise<void> {
  const users = Array.from({ length: 4 }).map((_, index) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    return [
      userIds[index],
      faker.internet.userName(firstName, lastName),
      faker.internet.email(firstName, lastName, 'example.com'),
      faker.name.findName(firstName, lastName),
      faker.internet.avatar(),
    ];
  });

  await db.raw(
    `
      INSERT INTO users (id, username, email, display_name, photo_url)
      VALUES ${users.map(() => '(?, ?, ?, ?, ?)').join(', ')}
      ON CONFLICT DO NOTHING
    `,
    users.reduce((acc, v) => [...acc, ...v], []),
  );
}
