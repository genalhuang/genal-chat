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
  SET_USER_GATHER
} from './mutation-types'

const actions: ActionTree<ChatState, RootState> = {
  async getUserById({commit}, userId) {
    let res = await fetch(`/user?userId=${userId}`)
    return processReturn(res)
  },

  async getGroups({commit}, userId) {
    let res = await fetch(`/group?userId=${userId}`)
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
  async connectSocket({commit, state,rootState}, callback) {
    let user = rootState.app.user
    let socket = io.connect(`/chat?userId=${user.userId}`);
    socket.on('connect',async ()=> {
      console.log('连接成功')

      // 先保存好socket对象
      commit(SET_SOCKET, socket)

      // 初始化事件监听
      socket.on('addGroup',(res:any)=> {
        console.log('on addGroup',res)
        if(!res.code) {
          commit(ADD_GROUP, res.data)
        } else {
          if(res.data === '该房间已存在') {
          }
        }
      })

      socket.on('joinGroup',(res:any)=> {
        console.log('on joinGroup',res)
        if(res.code) {
          return Vue.prototype.$message.error(res.message)
        }
        let myuser = res.data.user
        let mygroup = res.data.group
        if(myuser.userId != user.userId) {
          commit(SET_USER_GATHER, myuser)
          return Vue.prototype.$message.info(`${myuser.username}加入群${mygroup.groupname}`)
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
        if(!res.code) {
          // 新加入的好友存储一下信息
          commit(SET_USER_GATHER, res.data)

          // 双方进入房间
          if(res.data.userId === user.userId) {
            commit(ADD_FRIEND, res.data)
          }
          // 如果当前用户是被添加的用户,当前用户加入room
          if(res.data.friendId === user.userId) {
            let friendData: FriendMessageDto = JSON.parse(JSON.stringify(res.data))
            let temp = friendData.userId
            friendData.userId = friendData.friendId
            friendData.friendId = temp
            commit(ADD_FRIEND,friendData)
            socket.emit('joinFriend', res.data)
          }
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
      
      // 这个是获取群和群消息的回调
      for(var key in callback) {
        // for in 中使用await是可以的
        await callback[key]()
      }
    })
  },

  // 获取用户所有群和群消息
  async getGroupAndMessages({commit, dispatch, state,rootState}, payload) {
    let user = rootState.app.user
    let socket = state.socket
    let groups = await dispatch('getGroups', user.userId)
    if(groups) {
      commit(SET_GROUPS, groups)
      state.activeRoom = groups[0]
      // 获取到所有群之后加入对应socket并获取群消息
      groups.map(async(group: GroupDto)=>{
        socket.emit('joinGroup', group)
        let groupMessages = await dispatch('getGroupMessages', group.groupId)
        if(groupMessages) {
          commit(SET_GROUP_MESSAGES, groupMessages)
        }
      })
    }
  },

  // 获取用户所有好友和好友聊天记录
  async getFriendAndMessages({commit, dispatch, state, rootState}, payload) {
    let user = rootState.app.user
    let socket = state.socket
    let friends = await dispatch('getFriends', user.userId)
    if(friends) {
      commit(SET_FRIENDS, friends)
      // 获取到所有好友之后加入对应socket
      friends.map(async (friend: FriendDto)=>{
        socket.emit('joinFriend', friend)
        let friendMessages = await dispatch('getFriendMessages', {userId: user.userId, friendId: friend.friendId})
        if(friendMessages) {
          commit(SET_FRIEND_MESSAGES, friendMessages)
        }
      })
    }
  },

  // 获取(群消息和用户消息都)需要的用户信息
  async getUserGather({commit, dispatch, state, rootState}) {
    let user = rootState.app.user
    let userGather = state.userGather;

    // 处理群里面的用户信息
    for(let group of state.groups) {
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

  // 当群或者好友新增一个用户时获取用户信息
  async addUserGather({commit, dispatch, state, rootState}, payload) {
    console.log(payload)
    // let res = await dispatch('getUserById', payload.friendId)
    // commit(SET_USER_GATHER, res)
  }
}

export default actions;