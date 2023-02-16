import React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Index from './pages/Index';
import SnackBar from 'components/SnackBar';
import ConfirmDialog from './components/ConfirmDialog';
import { StoreProvider } from './store';
import { ethers } from 'ethers';
import store from 'store2';
import { initSocket } from 'utils/socket';
import { ConfigApi } from 'apis';
import * as Base64 from 'js-base64';
import * as SDK from 'rum-sdk-browser';

const App = observer(() => {
  const state = useLocalObservable(() => ({
    ready: false
  }));

  React.useEffect(() => {
    (async () => {
      if (!store('address') || !store('base64PubKey')) {
        const wallet = ethers.Wallet.createRandom();
        const password = "123";
        const keystore = await wallet.encrypt(password, {
          scrypt: {
            N: 64
          }
        });
        const signingKey = new ethers.utils.SigningKey(wallet.privateKey);
        const pubKeyBuffer = SDK.utils.typeTransform.hexToUint8Array(signingKey.compressedPublicKey.replace('0x', ''));
        const base64PubKey = Base64.fromUint8Array(pubKeyBuffer, true);
        store('keystore', keystore.replaceAll('\\', ''));
        store('password', password);
        store('address', wallet.address);
        store('privateKey', wallet.privateKey);
        store('base64PubKey', base64PubKey);
      }

      const config = await ConfigApi.get();
      store('seedUrl', config.seedUrl);
      
      const socket = initSocket();
      socket.on('connected', msg => console.log(msg));

      state.ready = true;
    })();
  }, []);

  if (!state.ready) {
    return null;
  }

  return (
    <StoreProvider>
      <Router>
        <div>
          <Route path="/" component={Index} />
          <SnackBar />
          <ConfirmDialog />
        </div>
      </Router>
    </StoreProvider>
  );
});

export default App;
