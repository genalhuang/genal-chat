import fetch from '@/api/fetch';

/**
 * 发送消息
 * @param Chat
 */
export const sendChat = (params: GroupMessage) => {
  return fetch.post('/chat', {
    ...params,
  });
};

/**
 * 获取消息
 * @param Chat
 */
export const getChat = (params: string) => {
  return fetch.get(`/chat?group=${params}`);
};
