import { ActionTree } from 'vuex';
import { ChatState } from './state'
import { RootState } from '../../index'
import fetch from '@/api/fetch';
import io from 'socket.io-client'
import Vue from 'vue'
import { 
  SET_SOCKET,
  ADD_GROUP,
  SET_GROUPS,
  ADD_GROUP_MESSAGE,
  SET_GROUP_MESSAGES,
  ADD_FRIEND, 
  SET_FRIENDS,
  ADD_FRIEND_MESSAGE,
  SET_FRIEND_MESSAGES
} from './mutation-types'

const actions: ActionTree<ChatState, RootState> = {
  async getGroups({commit}, payload) {
    let res = await fetch(`/group?usrId=${payload}`)
    console.log(res)
  },
  async getGroupMessages({commit}, payload) {
    let res = await fetch('/group/messages')
    console.log(res)
  },
  async getFriends({commit}, payload) {
    let res = await fetch(`/friend?usrId=${payload}`)
    console.log(res)
  },
  async getFriendMessages({commit}, payload) {
    let res = await fetch(`/friend/messaegs?userId=${payload.userId}&friendId=${payload.friendId}`)
    console.log(res)
  },
  async connectSocket({commit, state,rootState}, payload) {
    let user = rootState.app.user
    let socket = io.connect(`/chat?userId=${user.userId}`);
    socket.on('connect',()=> {
      console.log('连接成功')

      commit(SET_SOCKET, socket)
      
      // 初始化事件监听
      socket.on('addGroup',(res:any)=> {
        console.log(res)
        if(!res.code) {
          commit(ADD_GROUP, res.data)
        }
      })

      socket.on('joinGroup',(res:any)=> {
        console.log(res)
        if(!res.code) {
          commit(ADD_GROUP, res.data)
        }
      })

      socket.on('groupMessage',(res:any)=> {
        console.log('groupMessage',res)
        if(!res.code) {
          commit(ADD_GROUP_MESSAGE, res.data)
        }
      })

      socket.on('addFriend',(res:any)=> {
        console.log(res)
        if(!res.code) {
          // 双方进入房间
          if(res.data.data.userId === user.userId || res.data.data.friendId === user.userId) {
            commit(ADD_FRIEND, res.data)
          }
          // 如果当前用户是被添加的用户,当前用户加入room
          if(res.data.data.friendId === user.userId) {
            socket.emit('joinFriend', res.data)
          }
        }
      })

      socket.on('joinFriend',(res:any)=> {
        console.log(res)
        if(!res.code) {
          console.log('成功加入私聊房间')
        }
      })

      socket.on('friendMessage',(res:any)=> {
        console.log(res)
        if(!res.code) {
          commit(ADD_FRIEND_MESSAGE, res.data)
        }
      })

      // setInterval(()=> {
      //   socket.emit('groupMessage',{
      //     userId: user.userId,
      //     groupId: 'public',
      //     content: '傻逼',
      //     time: new Date().valueOf()
      //   })
      // },3000)
      // socket.emit('addGroup', {
      //   groupname:'陈冠希后援会1',
      //   userId: user.userId,
      //   createTime: new Date().valueOf()
      // })

    })
  },
  async getGroupAndMessages({commit, state,rootState}, payload) {
    let user = rootState.app.user
    let res = await fetch.get(`/group?userId=${user.userId}`)
    let {code, data} = res.data
    if(code) {
      Vue.prototype.$message.error('获取群组失败')
    }
    commit(SET_GROUPS, data)
    data.forEach(async (group: GroupDto) => {
      let res = await fetch.get(`/group/messages?groupId=${group.groupId}`)
      let {code, data} = res.data
      if(code) {
        Vue.prototype.$message.error('获取群组消息失败')
      }
      commit(SET_GROUP_MESSAGES, data)
    });
  }
}

export default actions;