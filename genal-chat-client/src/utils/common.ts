import Vue from 'vue';
import { AxiosResponse } from 'axios';

// 处理所有后端返回的数据
export function processReturn(res: AxiosResponse<ServerRes>) {
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
 * 屏蔽词
 * @param text 文本
 */
export function parseText(text: string) {
  return text;
}

/**
 * 判断是否URL
 * @param text 文本
 */
export function isUrl(text: string) {
  // 解析网址
  const UrlReg = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
  return UrlReg.test(text);
}

/**
 * 消息时间格式化
 * @param time
 */
export function formatTime(time: number) {
  let moment = Vue.prototype.$moment;
  // 大于昨天
  if (
    moment()
      .add(-1, 'days')
      .startOf('day') > time
  ) {
    return moment(time).format('M/D HH:mm');
  }
  // 昨天
  if (moment().startOf('day') > time) {
    return '昨天 ' + moment(time).format('HH:mm');
  }
  // 大于五分钟不显示秒
  if (new Date().valueOf() > time + 300000) {
    return moment(time).format('HH:mm');
  }
  return moment(time).format('HH:mm:ss');
}

/**
 * 群名/用户名校验
 * @param name
 */
export function nameVerify(name: string): boolean {
  let nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  if (name.length === 0) {
    Vue.prototype.$message.error('请输入名字');
    return false;
  }
  if (!nameReg.test(name)) {
    Vue.prototype.$message.error('名字只含有汉字、字母、数字和下划线 不能以下划线开头和结尾');
    return false;
  }
  if (name.length > 9) {
    Vue.prototype.$message.error('名字太长');
    return false;
  }
  return true;
}

/**
 * 密码校验
 * @param password
 */
export function passwordVerify(password: string): boolean {
  const passwordReg = /^\w+$/gis;
  if (password.length === 0) {
    Vue.prototype.$message.error('请输入密码');
    return false;
  }
  if (!passwordReg.test(password)) {
    Vue.prototype.$message.error('密码只含有字母、数字和下划线');
    return false;
  }
  if (password.length > 9) {
    Vue.prototype.$message.error('密码太长');
    return false;
  }
  return true;
}
