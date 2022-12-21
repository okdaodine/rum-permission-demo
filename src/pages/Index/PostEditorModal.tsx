import { observer, useLocalObservable } from 'mobx-react-lite';
import { TextField } from '@material-ui/core';
import { IPost } from 'apis/types';
import { TrxStorage } from 'apis/common';
import { TrxApi } from 'apis';
import Dialog from 'components/Dialog';

interface IProps {
  open: boolean
  onClose: () => void
  post: IPost,
  onPostChanged: (post: IPost) => void,
}

const Editor = observer((props: IProps) => {
  const state = useLocalObservable(() => ({
    content: props.post.content,
  }));

  const submitPost = async (content: string) => {
    const res = await TrxApi.createObject({
      content,
      type: 'Note'
    });
    console.log(res);
    state.content = '';
    props.onClose();
    props.onPostChanged({
      ...props.post,
      storage: TrxStorage.cache,
      content
    });
  }

  return (
    <div className="w-[600px] p-8 pt-6">
      <TextField
        className="w-full"
        size="small"
        multiline
        autoFocus
        minRows={3}
        value={state.content}
        onChange={(e) => { state.content = e.target.value; }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && state.content.trim()) {
            submitPost(state.content.trim());
            e.preventDefault();
          }
        }}
        margin="dense"
        variant="outlined"
        type="memo"
      />
    </div>
  )
});

export default observer((props: IProps) => (
  <Dialog
    hideCloseButton
    open={props.open}
    onClose={props.onClose}
    transitionDuration={{
      enter: 300,
    }}
  >
    <Editor {...props} />
  </Dialog>
));
