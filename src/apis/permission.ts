import request from 'request';
import { API_BASE_URL } from './common';

export default {
  async get(pubKey: string) {
    await request(`${API_BASE_URL}/permission/${pubKey}`);
  },
    
  async tryAdd(pubKey: string) {
    const res = await request(`${API_BASE_URL}/permission/${pubKey}`, {
      method: 'POST'
    });
    return res as {
      allow?: {
        GroupOwnerPubkey: string
        GroupOwnerSign: string
        Memo: string
        Pubkey: string
        TimeStamp: number
      }
    };
  },
}