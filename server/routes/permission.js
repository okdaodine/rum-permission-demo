const router = require('koa-router')();
const axios = require('axios');
const config = require('../config');
const SDK = require('rum-sdk-nodejs');
const { assert, Errors } = require('../utils/validator');

router.get('/:pubKey', get);
router.post('/:pubKey', tryAdd);

async function get(ctx) {
  const { pubKey } = ctx.params;
  const allow = await getChainAuth(pubKey);
  assert(allow, Errors.ERR_NOT_FOUND('allow'));
  ctx.body = true;
}

async function tryAdd(ctx) {
  const { pubKey } = ctx.params;
  const allow = await getChainAuth(pubKey);
  if (allow) {
    ctx.body = { allow };
  } else {
    await updateChainAuth(ctx.params.pubKey, 'add');
    ctx.body = {};
  }
}

const getChainAuth = async (pubKey) => {
  try {
    const group = SDK.utils.seedUrlToGroup(config.seedUrl);
    const { origin } = new URL(group.chainAPIs[0]);
    const res = await axios.get(`${origin}/api/v1/group/${group.groupId}/trx/allowlist`);
    const allowList = res.data || [];
    console.log(`[]:`, { allowList });
    return allowList.find(item => item.Pubkey === pubKey) || null;
  } catch (err) {
    return null;
  }
}

const updateChainAuth = async (pubKey, action) => {
  try {
    const group = SDK.utils.seedUrlToGroup(config.seedUrl);
    const payload = {
      group_id: group.groupId,
      type: 'upd_alw_list',
      config: JSON.stringify({
        action,
        pubkey: pubKey,
        trx_type: ['post'],
        memo: ''
      })
    };
    const { origin } = new URL(group.chainAPIs[0]);
    const res = await axios.post(`${origin}/api/v1/group/chainconfig`, payload);
    console.log(`[updateChainAuth]:`)
    console.log({ 'res.data': res.data });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = router;