import fetch from '@/api/fetch';

/**
 * 登录
 * @param User
 */
export const addUser = (params: User) => {
  return fetch.post('/user/regist', {
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

/**
 * 更新用户信息
 * @param User
 */
export const patchUser = (params: User) => {
  return fetch.patch(`/user/${params.userId}`, {
    ...params
  });
};