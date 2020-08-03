import fetch from '@/api/fetch';

/**
 * 群名模糊搜索用户
 * @param string
 */
export function getGroupsByName(groupName: string) {
  return fetch.get(`/group/findByName?groupName=${groupName}`);
}
