const fs = require('fs');
const path = require('path');
const QuorumLightNodeSDK = require('quorum-light-node-sdk-nodejs');

(async () => {
  fs.rmSync(path.join(__dirname, 'db.json'), { recursive: true, force: true });
  QuorumLightNodeSDK.cache.Group.clear();
  console.log('Removed local data ✅ ');
})();
