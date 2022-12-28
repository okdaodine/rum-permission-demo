const router = require('koa-router')();
const { assert, Errors, throws } = require('../utils/validator');
const QuorumLightNodeSDK = require('quorum-light-node-sdk-nodejs');

router.post('/', sendTrx);
router.get('/:trxId', get);

async function sendTrx(ctx) {
  const payload = ctx.request.body;
  assert(payload, Errors.ERR_IS_REQUIRED('payload'));
  const group = QuorumLightNodeSDK.cache.Group.list()[0];
  assert(group, Errors.ERR_IS_REQUIRED('group'));
  try {
    const res = await QuorumLightNodeSDK.chain.Trx.send(group.groupId, payload);
    ctx.body = res;
  } catch (err) {
    if (err.response.status === 403) {
      throws(Errors.ERR_NO_PERMISSION('post'));
    }
    throws(Errors.ERR_IS_REQUEST_FAILED());
  }
}

async function get(ctx) {
  const group = QuorumLightNodeSDK.cache.Group.list()[0];
  assert(group, Errors.ERR_IS_REQUIRED('group'));
  try {
    ctx.body = await QuorumLightNodeSDK.chain.Trx.get(group.groupId, ctx.params.trxId);
  } catch (err) {
    console.log(err);
    throws(Errors.ERR_IS_REQUEST_FAILED());
  }
}

module.exports = router;