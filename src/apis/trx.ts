import request from 'request';
import { API_BASE_URL } from './common';
import { IObject, IPerson, ITrx, utils } from 'quorum-light-node-sdk';
import store from 'store2';

export default {
  createObject(object: IObject) {
    return createTrx(object, '_Object');
  },

  createPerson(person: IPerson) {
    return createTrx(person, 'Person');
  },

  async get(trxId: string) {
    const res: ITrx = await request(`${API_BASE_URL}/trx/${trxId}`);
    return res;
  }
}

async function createTrx(data: IObject | IPerson, type: '_Object' | 'Person') {
  const group = utils.restoreSeedFromUrl(store('seedUrl'));
  const payload = await utils.signTrx({
    type,
    data,
    groupId: group.group_id,
    aesKey: group.cipher_key,
    privateKey: store('privateKey'),
  });
  console.log(payload);
  const res: { trx_id: string } = await request(`${API_BASE_URL}/trx`, {
    method: 'POST',
    body: payload
  });
  return res;
};

