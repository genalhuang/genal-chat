import fetch from '@/api/fetch';

// /**
//  * 用户加入添加群組
//  * @param Group
//  */
// export const userJoinGroup = (params: Group) => {
//   return fetch.post('/group', {
//     ...params,
//   });
// };

/**
 * 获取用户所有聊天群
 */
export const getGroups = (name: string) => {
  return fetch.get(`/group?name=${name}`)
}
