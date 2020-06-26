import axios, { AxiosInstance } from 'axios';
import { requestSuccess, requestFail, responseSuccess, responseFail } from './interceptors';
import { socketUrl } from './config';

const fetch: AxiosInstance = axios.create({
  timeout: 60000, // 超时时间一分钟
  baseURL: socketUrl,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
});

fetch.interceptors.request.use(requestSuccess, requestFail);
fetch.interceptors.response.use(responseSuccess, responseFail);

export default fetch;
