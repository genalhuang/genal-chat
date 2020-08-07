import fetch from '@/api/fetch';

/**
 * 更新用户信息
 * @param params
 */
export const patchUser = (params: User) => {
  return fetch.patch(`/user/${params.userId}`, {
    ...params,
  });
};

/**
 * 用户名模糊搜索用户
 * @param username
 */
export function getUsersByName(username: string) {
  return fetch.get(`/user/findByName?username=${username}`);
}

/**
 * 用户头像上传
 * @param params
 */
export function setUserAvatar(params: FormData) {
  return fetch.post(`/user/avatar`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
