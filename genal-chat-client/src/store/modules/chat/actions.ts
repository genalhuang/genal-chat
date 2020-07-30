import {ActionTree} from 'vuex';
import {ChatState} from './state'
import {RootState} from '../../index'
import fetch from '@/api/fetch';
import io from 'socket.io-client'
import Vue from 'vue'
import {processReturn} from '@/utils/common.ts';
import {
  SET_SOCKET,
  ADD_GROUP_MESSAGE,
  SET_GROUP_MESSAGES,
  ADD_FRIEND_MESSAGE,
  SET_FRIEND_MESSAGES,
  SET_GROUP_GATHER,
  SET_FRIEND_GATHER,
  SET_USER_GATHER,
  SET_ACTIVE_ROOM
} from './mutation-types'

const actions: ActionTree<ChatState, RootState> = {
  // 初始化socket连接和监听socket事件
  async connectSocket({commit, state, dispatch, rootState}, callback) {
    let user = rootState.app.user
    let friendGather = state.friendGather
    let socket = io.connect(`/?userId=${user.userId}`);
    socket.on('connect', async () => {
      console.log('连接成功')

      // 获取聊天室所需所有信息
      socket.emit('chatData', user)

      // 先保存好socket对象
      commit(SET_SOCKET, socket)

      // 初始化事件监听
      socket.on('addGroup', (res: any) => {
        console.log('on addGroup', res)
        if (res.code) {
          return Vue.prototype.$message.error(res.message)
        }
        commit(SET_GROUP_GATHER, res.data)
      })

      socket.on('joinGroup', async (res: any) => {
        console.log('on joinGroup', res)
        if (res.code) {
          return Vue.prototype.$message.error(res.message)
        }
        let newUser = res.data.user
        let group = res.data.group
        if (newUser.userId != user.userId) {
          commit(SET_USER_GATHER, newUser)
          return Vue.prototype.$message.info(`${newUser.username}加入群${group.groupName}`)
        } else {
          console.log(state.groupGather, group.groupId)
          // 是用户自己 则加入到某个群
          if (!state.groupGather[group.groupId]) {
            commit(SET_GROUP_GATHER, group)
            // 获取群里面所有用户的用户信息
            socket.emit('chatData', user)
          }
        }
      })

      socket.on('joinGroupSocket', (res: any) => {
        console.log('on joinGroupSocket', res)
        if (res.code) {
          return Vue.prototype.$message.error(res.message)
        }
        let newUser: Friend = res.data.user
        let group: Group = res.data.group
        if (newUser.userId != user.userId) {
          commit(SET_USER_GATHER, newUser)
          if(friendGather[newUser.userId]) {
            // 当用户的好友更新了用户信息
            let messages;
            if(friendGather[newUser.userId].messages) {
              messages = friendGather[newUser.userId].messages
            }
            commit(SET_FRIEND_GATHER, newUser)
            commit(SET_FRIEND_MESSAGES, messages)
          }
          return Vue.prototype.$message.info(`${newUser.username}加入群${group.groupName}`)
        } else {
          if (!state.groupGather[group.groupId]) {
            commit(SET_GROUP_GATHER, group)
          }
          commit(SET_USER_GATHER, newUser)
        }
      })

      socket.on('groupMessage', (res: any) => {
        console.log('on groupMessage', res)
        if (!res.code) {
          commit(ADD_GROUP_MESSAGE, res.data)
        }
      })

      socket.on('addFriend', (res: any) => {
        console.log('on addFriend', res)
        if (!res.code) {
          commit(SET_FRIEND_GATHER, res.data)
          commit(SET_USER_GATHER, res.data)
          socket.emit('joinFriendSocket', {
            userId: user.userId,
            friendId: res.data.userId
          })
        } else {
          Vue.prototype.$message.error(res.message)
        }
      })

      socket.on('joinFriendSocket', (res: any) => {
        console.log('on joinFriendSocket', res)
        if (!res.code) {
          console.log('成功加入私聊房间')
        }
      })

      socket.on('friendMessage', (res: any) => {
        console.log('on friendMessage', res)

        if (!res.code) {
          if (res.data.friendId === user.userId || res.data.userId === user.userId) {
            console.log('ADD_FRIEND_MESSAGE', res.data)
            commit(ADD_FRIEND_MESSAGE, res.data)
          }
        }
      })

      socket.on('chatData', (res: any) => {
        if(res.code) {
          return Vue.prototype.$message.error(res.message)
        }
        dispatch('handleChatData', res.data)
      })
    })
  },

  async handleChatData({commit, dispatch, state, rootState}, payload) {
    let user = rootState.app.user
    let socket = state.socket
    let groupGather = state.groupGather
    let groupArr = payload.groupData
    let friendArr = payload.friendData
    let userArr = payload.userData
    if(groupArr.length) {
      for(let group of groupArr) {
        socket.emit('joinGroupSocket', {
          groupId: group.groupId,
          userId: user.userId
        })
        commit(SET_GROUP_GATHER, group)
      }
    }
    if(friendArr.length) {
      for(let friend of friendArr) {
        socket.emit('joinFriendSocket', {
          userId: user.userId,
          friendId: friend.userId
        })
        commit(SET_FRIEND_GATHER, friend)
      }
    }
    if(userArr.length) {
      for(let user of userArr) {
        commit(SET_USER_GATHER, user)
      }
    }
    // 更新完数据设置默认active群为public
    commit(SET_ACTIVE_ROOM, groupGather.public)
  }
}

export default actions;
