const db = require('../utils/db');
const QuorumLightNodeSDK = require('quorum-light-node-sdk-nodejs');
const { getSocketIo } = require('../socket');

module.exports = async (item) => {
  console.log('handle comment', item);
  await db.read();
  const {
    TrxId,
    Data: {
      inreplyto,
      content
    },
    SenderPubkey,
    TimeStamp,
  } = item;
  const comment = {
    trxId: TrxId,
    to: inreplyto.trxid,
    content,
    userAddress: QuorumLightNodeSDK.utils.pubkeyToAddress(SenderPubkey),
    timestamp: parseInt(String(TimeStamp / 1000000), 10)
  };
  db.data.comments.push(comment);
  await db.write();
  getSocketIo().emit('comment', comment);
}
