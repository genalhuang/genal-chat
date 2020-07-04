import Vue from 'vue'
import {AxiosResponse} from 'axios'

// 处理所有后端返回的数据
export function processReturn(res: AxiosResponse<any>) {
  // code 0:成功 1:错误 2:后端报错
  let {code, message, data} = res.data
  if(code) {
    Vue.prototype.$message.error(message)
    return;
  }
  if(message){
    Vue.prototype.$message.success(message)
  }
  return data;
}