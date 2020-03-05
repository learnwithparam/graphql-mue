/* eslint-disable @typescript-eslint/camelcase */
import util from 'util';
import db from '../db';
import { upsert as identityUpsert } from '../identity/repository';

const users = db.table('users');

export async function upsert({
  transaction = users,
  payload: { email, username, display_name, photo_url, time_zone },
}) {
  const insert = transaction
    .insert({ email, username, display_name, photo_url, time_zone })
    .toString();

  const update = transaction
    .update({ email, username, display_name, photo_url, time_zone })
    .whereRaw('users.email = ?', [email]);
  const query = util.format(
    '%s ON CONFLICT (email) DO UPDATE SET %s',
    insert.toString(),
    update.toString().replace(/^update\s.*\sset\s/i, ''),
  );

  return db.raw(query);
}

export async function findOrCreate({ where = {}, payload, options = {} }) {
  const { transaction = null } = options;
  const trx = transaction ? transaction('users') : users;
  return new Promise((resolve, reject) => {
    return trx
      .where(where)
      .then(res => {
        if (res.length === 0) {
          return trx.insert(payload);
        } else {
          return res;
        }
      })
      .then(resolve)
      .catch(reject);
  });
}

export async function registerUser({ user, identity }) {
  return new Promise(async (resolve, reject) => {
    return db.transaction(async trx => {
      try {
        const [entity] = await findOrCreate({
          payload: user,
          where: {
            email: user.email,
          },
          options: {
            transaction: trx,
          },
        });

        await identityUpsert({
          payload: {
            user_id: entity.id,
            ...identity,
          },
          options: {
            transaction: trx,
          },
        });
        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  });
}
