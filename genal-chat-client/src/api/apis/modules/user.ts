import fetch from '@/api/fetch';

/**
 * 登录
 * @param User
 */
export const addUser = (params: User) => {
  return fetch.post('/user', {
    ...params,
  });
};

/**
 * 获取用户
 * @param User
 */
export const getUser = () => {
  return fetch.get('/user');
};
