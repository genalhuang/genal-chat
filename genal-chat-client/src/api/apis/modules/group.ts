import fetch from '@/api/fetch';

/**
 * 添加群組
 * @param Group
 */
export const addGroup = (params: Group) => {
  return fetch.get('/group', {
    params,
  });
};
