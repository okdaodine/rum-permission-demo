const db = require('../utils/db');
const QuorumLightNodeSDK = require('quorum-light-node-sdk-nodejs');

module.exports = async (item) => {
  console.log('handle profile', item);
  await db.read();
  const {
    TrxId,
    Data: {
      name,
    },
    SenderPubkey,
  } = item;
  db.data.profiles.unshift({
    trxId: TrxId,
    name,
    userAddress: QuorumLightNodeSDK.utils.pubkeyToAddress(SenderPubkey),
  });
  await db.write();
}
