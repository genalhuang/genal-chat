import { ActionTree } from 'vuex';
import { ChatState } from './state'
import { RootState } from '../../index'
import fetch from '@/api/fetch';
import io from 'socket.io-client'
import Vue from 'vue'
import { processReturn } from '@/utils/common.ts';
import { 
  SET_SOCKET,
  ADD_GROUP,
  SET_GROUPS,
  ADD_GROUP_MESSAGE,
  SET_GROUP_MESSAGES,
  ADD_FRIEND, 
  SET_FRIENDS,
  ADD_FRIEND_MESSAGE,
  SET_FRIEND_MESSAGES,
  SET_GROUP_GATHER,
  SET_USER_GATHER
} from './mutation-types'

const actions: ActionTree<ChatState, RootState> = {
  async getUserById({commit}, userId) {
    let res = await fetch(`/user?userId=${userId}`)
    return processReturn(res)
  },

  async getGroups({commit}, groupId) {
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
    socket.on('connect',async ()=> {
      console.log('连接成功')

      // 先保存好socket对象
      commit(SET_SOCKET, socket)

      // 初始化事件监听
      socket.on('addGroup',(res:any)=> {
        console.log('on addGroup',res)
        if(res.code) {
          return Vue.prototype.$message.error(res.message)
        }
        commit(SET_GROUP_GATHER, res.data)
        commit(ADD_GROUP, res.data)
      })

      socket.on('joinGroup',(res:any)=> {
        console.log('on joinGroup',res)
        if(res.code) {
          return Vue.prototype.$message.error(res.message)
        }
        let newUser = res.data.user
        let group = res.data.group
        if(newUser.userId != user.userId) {
          commit(SET_USER_GATHER, newUser)
          return Vue.prototype.$message.info(`${newUser.username}加入群${group.groupname}`)
        }
        
      })

      socket.on('groupMessage',(res:any)=> {
        console.log('on groupMessage',res)
        if(!res.code) {
          commit(ADD_GROUP_MESSAGE, res.data)
        }
      })

      socket.on('addFriend',(res:any)=> {
        console.log('on addFriend',res)
        // user: 朋友的信息 chat: 聊天组所需要的信息
        if(!res.code) {
          // 新好友存储一下信息
          commit(SET_USER_GATHER, res.data.user)
          commit(ADD_FRIEND, res.data.chat)
          socket.emit('joinFriend', res.data.chat)
        } else {
          Vue.prototype.$message.error(res.message)
        }
      })

      socket.on('joinFriend',(res:any)=> {
        console.log('on joinFriend',res)
        if(!res.code) {
          console.log('成功加入私聊房间')
        }
      })

      socket.on('friendMessage',(res:any)=> {
        console.log('on friendMessage',res)

        if(!res.code) {
          if(res.data.friendId === user.userId || res.data.userId === user.userId ) {
            console.log('ADD_FRIEND_MESSAGE', res.data)
            commit(ADD_FRIEND_MESSAGE, res.data)
          }
        }
      })
      
      await dispatch('getGroupAndMessages')
      await dispatch('getFriendAndMessages')
      await dispatch('getGroupGather')
      await dispatch('getUserGather')
    })
  },

  // 获取用户所有群和群消息
  async getGroupAndMessages({commit, dispatch, state,rootState}, payload) {
    let user = rootState.app.user
    let socket = state.socket
    let groups = await dispatch('getUserGroups', user.userId)
    console.log('getGroups')
    if(groups) {
      commit(SET_GROUPS, groups)
      state.activeRoom = groups[0]
      // 获取到所有群之后加入对应socket并获取群消息
      let promise = groups.map(async(group: GroupDto)=>{
        console.log('joinGroup')
        socket.emit('joinGroup', group)
        let groupMessages = await dispatch('getGroupMessages', group.groupId)
        if(groupMessages) {
          commit(SET_GROUP_MESSAGES, groupMessages)
        }
      })
      await Promise.all(promise);
    }
  },

  // 获取用户所有好友和好友聊天记录
  async getFriendAndMessages({commit, dispatch, state, rootState}, payload) {
    let user = rootState.app.user
    let socket = state.socket
    let friends = await dispatch('getFriends', user.userId)
    console.log('friends')
    if(friends) {
      commit(SET_FRIENDS, friends)
      // 获取到所有好友之后加入对应socket
      let promise  = friends.map(async (friend: FriendDto)=>{
        console.log('joinFriend')
        socket.emit('joinFriend', friend)
        let friendMessages = await dispatch('getFriendMessages', {userId: user.userId, friendId: friend.friendId})
        if(friendMessages) {
          commit(SET_FRIEND_MESSAGES, friendMessages)
        }
      })
      await Promise.all(promise);
    }
  },

  // 获取用户所有群的群信息
  async getGroupGather({commit, dispatch, state, rootState}) {
    let groups = state.groups
    let groupGather = state.groupGather;
    for(let group of state.groups) {
      let res = await dispatch('getGroups', group.groupId)
      if(res) {
        if(!groupGather[res.userId]) {
          commit(SET_GROUP_GATHER, res)
        }
      }
    }
  },

  // 获取用户所有好友的好友信息
  async getUserGather({commit, dispatch, state, rootState}) {

    let user = rootState.app.user
    let userGather = state.userGather;
    // 处理群里面的用户信息
    for(let group of state.groups) {
      if(group.messages) {
        for(let message of group.messages) {
          // 这里做一下去重
          if(!userGather[message.userId]) {
            if(message.userId != user.userId) {
              let res = await dispatch('getUserById', message.userId)
              commit(SET_USER_GATHER, res)
            }
          }
        }
      }
    }

    // 处理好友里面的用户信息
    for(let friend of state.friends) {
      // 这里做一下去重
      if(!userGather[friend.userId]) { 
        if(friend.friendId != user.userId) {
          let res = await dispatch('getUserById', friend.friendId)
          commit(SET_USER_GATHER, res)
        }
      }
    }
     
    // 当然也要把自己的信息加进去啦
    commit(SET_USER_GATHER, user)
  },
}

export default actions;
