import Vue from 'vue'
import {AxiosResponse} from 'axios'

// 处理所有后端返回的数据
export function processReturn(res: AxiosResponse<any>) {
  let {code, message, data} = res.data
  if(code) {
    Vue.prototype.$message.error(message)
    return;
  }
  return data;
}