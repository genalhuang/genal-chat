import { ActionTree } from 'vuex';
import { ChatState } from './state'
import { RootState } from '../../index'
import fetch from '@/api/fetch';

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
  }
}

export default actions;