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
  SET_USER_GATHER
} from './mutation-types'

const actions: ActionTree<ChatState, RootState> = {
  async getUserById({commit}, userId) {
    let res = await fetch(`/user?userId=${userId}`)
    return processReturn(res)
  },

  async getGroup({commit}, groupId) {
    let res = await fetch(`/group?groupId=${groupId}`)
    return processReturn(res)
  },

  async getUserGroups({commit}, userId) {
    let res = await fetch(`/group/userGroup?userId=${userId}`)
    return processReturn(res)
  },

  async getGroupMessages({commit}, groupId) {
    let res = await fetch(`/group/messages?groupId=${groupId}`)
    return processReturn(res)
  },

  async getFriends({commit}, userId) {
    let res = await fetch(`/friend?userId=${userId}`)
    return processReturn(res)
  },

  async getFriendMessages({commit}, payload) {
    let res = await fetch(`/friend/messages?userId=${payload.userId}&friendId=${payload.friendId}`)
    return processReturn(res)
  },

  // 初始化socket连接和监听socket事件
  async connectSocket({commit, state, dispatch, rootState}, callback) {
    let user = rootState.app.user
    let socket = io.connect(`/chat?userId=${user.userId}`);
    socket.on('connect', async () => {
      console.log('连接成功')

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

      socket.on('joinGroup', (res: any) => {
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
          if (!state.groupGather[group.groupId]) {
            commit(SET_GROUP_GATHER, group)
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
          return Vue.prototype.$message.info(`${newUser.username}加入群${group.groupName}`)
        } else {
          if (!state.groupGather[group.groupId]) {
            commit(SET_GROUP_GATHER, group)
          }
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
          socket.emit('joinFriend', {
            userId: user.userId,
            friendId: res.data.userId
          })
        } else {
          Vue.prototype.$message.error(res.message)
        }
      })

      socket.on('joinFriend', (res: any) => {
        console.log('on joinFriend', res)
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

      await dispatch('getGroupAndMessages')
      await dispatch('getFriendAndMessages')
      await dispatch('getUserGather')
    })
  },

  // 获取用户所有群信息和群消息
  async getGroupAndMessages({commit, dispatch, state, rootState}, payload) {
    let user = rootState.app.user
    let socket = state.socket
    let groupMap: GroupMap[] = await dispatch('getUserGroups', user.userId)
    if (groupMap.length) {
      for (var i = 0; i < groupMap.length; i++) {
        let group = await dispatch('getGroup', groupMap[i].groupId)
        commit(SET_GROUP_GATHER, group)
        if (group) {
          socket.emit('joinGroupSocket', {
            groupId: group.groupId,
            userId: user.userId
          })
          commit(SET_GROUP_GATHER, group)
          let groupMessages = await dispatch('getGroupMessages', group.groupId)
          if (groupMessages.length) {
            commit(SET_GROUP_MESSAGES, groupMessages)
          }
        }
      }
    }
  },

  // 获取用户所有好友信息和好友聊天记录
  async getFriendAndMessages({commit, dispatch, state, rootState}, payload) {
    let user = rootState.app.user
    let socket = state.socket
    let userMap: UserMap[] = await dispatch('getFriends', user.userId)
    console.log('friends', userMap)
    if (userMap) {
      for (var i = 0; i < userMap.length; i++) {
        let friend: Friend = await dispatch('getUserById', userMap[i].friendId)
        commit(SET_FRIEND_GATHER, friend)
        commit(SET_USER_GATHER, friend)
        socket.emit('joinFriend', {
          userId: user.userId,
          friendId: friend.userId
        })
        let friendMessages:FriendMessage[] = await dispatch('getFriendMessages', {userId: user.userId, friendId: friend.userId})
        if(friendMessages) {
          commit(SET_FRIEND_MESSAGES, friendMessages)
        }
      }
    }
  },

    // 获取用户所有好友的好友信息
    async getUserGather({commit, dispatch, state, rootState}) {

      let user = rootState.app.user
      let userGather = state.userGather;
      let groupGather = state.groupGather
      // 处理群里面的用户信息
      for (let groupId in groupGather) {
        let group = groupGather[groupId]
        if (group.messages) {
          for (let message of group.messages) {
            // 这里做一下去重
            if (!userGather[message.userId]) {
              if (message.userId != user.userId) {
                let res = await dispatch('getUserById', message.userId)
                commit(SET_USER_GATHER, res)
              }
            }
          }
        }
      }

      // // 处理好友里面的用户信息
      // for(let friend of state.friends) {
      //   // 这里做一下去重
      //   if(!userGather[friend.userId]) {
      //     if(friend.userId != user.userId) {
      //       let res = await dispatch('getUserById', friend.userId)
      //       commit(SET_USER_GATHER, res)
      //     }
      //   }
      // }

      // 当然也要把自己的信息加进去啦
      commit(SET_USER_GATHER, user)
    }
  ,
  }

  export default actions;
