import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import GenalChat from '@/views/GenalChat.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Chat',
    component: GenalChat,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
