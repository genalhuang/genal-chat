import Vue from 'vue';
import { AxiosResponse } from 'axios';

// 处理所有后端返回的数据
export function processReturn(res: AxiosResponse<any>) {
  // code 0:成功 1:错误 2:后端报错
  let { code, message, data } = res.data;
  if (code) {
    Vue.prototype.$message.error(message);
    return;
  }
  if (message) {
    Vue.prototype.$message.success(message);
  }
  return data;
}

// 判断一个字符串是否包含另外一个字符串
export function isContainStr(str1: string, str2: string) {
  return str2.indexOf(str1) >= 0;
}
