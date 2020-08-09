import Vue from 'vue';
import { AxiosResponse } from 'axios';

// 处理所有后端返回的数据
export function processReturn(res: AxiosResponse<any>) {
  // code 0:成功 1:错误 2:后端报错
  let { code, msg, data } = res.data;
  if (code) {
    Vue.prototype.$message.error(msg);
    return;
  }
  if (msg) {
    Vue.prototype.$message.success(msg);
  }
  return data;
}

// 判断一个字符串是否包含另外一个字符串
export function isContainStr(str1: string, str2: string) {
  return str2.indexOf(str1) >= 0;
}

/**
 * 防止网络攻击
 * @param text 文本
 */
export function parseText(text: string) {
  let HTML = /<\/?.+?>/gi;
  let COOKIE = /document\.cookie/gi;
  let URL = /^\w+[^\s]+(\.[^\s]+){1,}$/gi;
  let HTTP = /http:\/\//gi;
  if (HTML.test(text)) {
    return '无效输入,别耍花样!';
  }
  if (COOKIE.test(text)) {
    return '无效输入,你想干嘛!';
  }
  // 解析网址
  if (URL.test(text)) {
    if (HTTP.test(text)) {
      return `<a onClick="window.open('${text}','_blank')" target="_blank">${text}</a>`;
    }
    return `<a onClick="window.open('http://${text}','_blank')" target="_blank">${text}</a>`;
  }
  return text;
}

/**
 * 消息时间格式化
 * @param time
 */
export function formatTime(time: number) {
  //@ts-ignore
  return Vue.prototype.$moment(time).format('HH:mm:ss');
}

/**
 * 群名/用户名校验
 * @param name
 */
export function nameVerify(name: string): boolean {
  //名字正则，只含有汉字、数字、字母、下划线不能以下划线开头和结尾
  let nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (name.length > 10) {
    Vue.prototype.$message.error('名字太长');
    return false;
  }
  if (name.length === 0) {
    Vue.prototype.$message.error('请输入名字');
    return false;
  }
  if (!nameReg.test(name)) {
    Vue.prototype.$message.error('名字只含有汉字、数字、字母、下划线不能以下划线开头和结尾');
    return false;
  }
  return true;
}
