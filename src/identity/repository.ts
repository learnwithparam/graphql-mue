/* eslint-disable @typescript-eslint/camelcase */
import util from 'util';
import db from '../db';

const identities = db.table('identities');

export async function upsert({
  payload: {
    user_id,
    provider,
    password = null,
    provider_id,
    profile_url,
    time_zone,
  },
  options = {},
}) {
  const { transaction = null } = options;
  const trx = transaction ? transaction('identities') : identities;

  const insert = trx
    .insert({
      user_id,
      provider,
      password,
      provider_id,
      profile_url,
      time_zone,
    })
    .toString();

  const update = trx
    .update({
      user_id,
      provider,
      password,
      provider_id,
      profile_url,
      time_zone,
    })
    .whereRaw('identities.user_id = ? AND identities.provider = ?', [
      user_id,
      provider,
    ]);
  const query = util.format(
    '%s ON CONFLICT ("user_id", "provider") DO UPDATE SET %s',
    insert.toString(),
    update.toString().replace(/^update\s.*\sset\s/i, ''),
  );

  return db.raw(query).transacting(transaction);
}
