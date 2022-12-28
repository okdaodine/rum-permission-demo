import sleep from 'utils/sleep';
import { PermissionApi } from 'apis';
import store from 'store2';

export default () => {
  const { confirmDialogStore, snackbarStore } = (window as any).store;
  confirmDialogStore.show({
    content: '您还没有开通权限<div>点击确定即可开通</div>',
    ok: async () => {
      if (confirmDialogStore.loading) {
        return;
      }
      await PermissionApi.tryAdd(store('base64PubKey'));
      while(true) {
        confirmDialogStore.setLoading(true);
        await sleep(2000);
        try {
          await PermissionApi.get(store('base64PubKey'));
          confirmDialogStore.hide();
          await sleep(400);
          snackbarStore.show({
            message: '开通成功，现在您可以开始使用啦',
            duration: 2500
          });
          console.log(`[here]:`, {  });
          return;
        } catch (_) {}
      }
    },
  });
}