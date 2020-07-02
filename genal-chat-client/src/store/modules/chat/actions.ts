import { ActionTree } from 'vuex';
import { ChatState } from './state'
import { RootState } from '../../index'
import fetch from '@/api/fetch';
import io from 'socket.io-client'
import { SET_SOCKET } from './mutation-types'

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
      console.log('鏈接成功')
      commit(SET_SOCKET, socket)
      socket.on('groupMessage',(res:any)=> {
        console.log(res)
      })
      socket.on('addGroup',(res:any)=> {
        console.log(res,11111)
      })
      // setInterval(()=> {
      //   socket.emit('groupMessage',{
      //     userId: user.userId,
      //     groupId: 'public',
      //     content: '傻逼',
      //     time: new Date().valueOf()
      //   })
      // },3000)
      socket.emit('addGroup', {
        groupname:'陈冠希后援会1',
        userId: user.userId,
        createTime: new Date().valueOf()
      })

    })
  }
}

export default actions;