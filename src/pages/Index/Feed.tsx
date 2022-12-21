import React from 'react';
import { runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { TextField } from '@material-ui/core';
import { IPost, IProfile } from 'apis/types';
import { TrxStorage } from 'apis/common';
import ProfileEditorDialog from './ProfileEditorDialog';
import PostItem from './PostItem';
import store from 'store2';
import { isEmpty } from 'lodash';
import { PostApi, ProfileApi, TrxApi } from 'apis';
import { getSocket } from 'utils/socket';

export default observer(() => {
  const state = useLocalObservable(() => ({
    content: '',
    searchInput: '',
    trxIds: [] as string[],
    postMap: {} as Record<string, IPost>,
    profileMap: {} as Record<string, IProfile>,
    showProfileEditorModal: false,
    unreadCount: 0,
    get myProfile () {
      return state.profileMap[store('address')]
    }
  }));
  const profileName = state.myProfile ? state.myProfile.name : store('address').slice(0, 10);

  React.useEffect(() => {
    const listener = (post: IPost) => {
      console.log('received a post', post);
      console.log({ post });
      if (state.postMap[post.trxId]) {
        state.postMap[post.trxId].storage = TrxStorage.chain;
      }
    }
    getSocket().on('post', listener);
    return () => {
      getSocket().off('post', listener);
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        runInAction(() => {
          state.trxIds = [];
          state.postMap = {};
        })

        const posts = await PostApi.list({
          viewer: store('address'),
          limit: 100
        });
        runInAction(() => {
          for (const post of posts) {
            state.trxIds.push(post.trxId);
            state.postMap[post.trxId] = post;
          }
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        const profile = await ProfileApi.get(store('address'));
        if (!isEmpty(profile)) {
          state.profileMap[store('address')] = profile;
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const submitPost = async (content: string) => {
    const res = await TrxApi.createObject({
      content,
      type: 'Note'
    });
    console.log(res);
    const post = {
      content,
      userAddress: store('address'),
      trxId: res.trx_id,
      storage: TrxStorage.cache,
      timestamp: Date.now(),
      extra: {
        profile: state.profileMap[store('address')],
        liked: false,
        likeCount: 0,
        commentCount: 0,
      }
    };
    state.trxIds.unshift(post.trxId);
    state.postMap[post.trxId] = post;
    state.content = '';
  }

  const onPostChanged = async (post: IPost) => {
    state.postMap[post.trxId] = post;
  }

  const onProfileChanged = async (profile: IProfile) => {
    state.profileMap[profile.userAddress] = profile;
  }

  return (
    <div>
      <div className="flex justify-between relative">
        <div className="flex items-center text-gray-700 mb-2">
          <img src={`https://ui-avatars.com/api/?name=${profileName.slice(-1)}`} alt="avatar" className="w-[32px] h-[32px] rounded-full mr-3" />
          <div>{profileName}</div>
          <div className="text-12 text-blue-400 ml-3 cursor-pointer" onClick={() => {
            state.showProfileEditorModal = true;
          }}>修改</div>
          <ProfileEditorDialog
            open={state.showProfileEditorModal}
            onClose={() => {
              state.showProfileEditorModal = false;
            }}
            profile={null}
            onProfileChanged={onProfileChanged}
          />
        </div>
      </div>
      <TextField
        className="w-full"
        placeholder="说点什么..."
        size="small"
        multiline
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

      <div className="mt-5">
        {state.trxIds.map((trxId) => (
          <div key={trxId}>
            <PostItem post={state.postMap[trxId]} onPostChanged={onPostChanged} onDeletePost={trxId => {
              state.trxIds = state.trxIds.filter(id => id !== trxId);
              delete state.postMap[trxId];
            }} />
          </div>
        ))}
      </div>
    </div>
  )
});

