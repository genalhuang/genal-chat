# 阿童木聊天室
[![author](https://img.shields.io/badge/author-genaller-blue.svg)](https://github.com/genaller)
[![author](https://img.shields.io/github/languages/top/genaller/genal-chat)](https://github.com/genaller/genal-chat)
[![Node.js Version](https://img.shields.io/badge/node.js-10.16.3-blue.svg)](http://nodejs.org/download)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/genaller/genal-chat/blob/master/LICENSE)
[![author](https://img.shields.io/github/stars/genaller/genal-chat?style=social)](https://github.com/genaller/genal-chat)
> #### [码云](https://gitee.com/edison_dec/genal-chat)<br>
> #### 在线地址[www.genal.fun](http://www.genal.fun)

### 项目简介
  😛 闲暇时间想做一个聊天室来巩固前端技能，于是在2020年6月24号就开始了阿童木聊天室的开发之旅。<br>
  😈 项目采用全typescript开发，这是为了以后的功能迭代打基础。当然，我本身也是很喜欢typescript的。<br>
  🧐 目前聊天室已经具备完整的聊天功能，今后会陆续开发更多酷炫的功能，喜欢的朋友给个star鼓励一下我吧!<br>

### 项目界面
![](./assets/genal.gif)

### 功能介绍
- 群聊/私聊
- 创建群/加入群聊/模糊搜索群
- 添加好友/模糊搜索好友
- 图片上传/粘贴发送图片/图片预览
- 更改用户名/头像上传
- 表情包
- 消息分页

### 技术概览
- **Typescript**：JavaScript 的一个超集，它最大的优势是提供了类型系统和提高了代码的可读性和可维护性。
- **Vue2.6.x**：前端渐进式框架。
- **Socket/io**：实现实时通信，websocket第三方库。
- **Vuex**：专为 Vue.js 应用程序开发的状态管理模式。
- **Nestjs**：是一个用于构建高效、可扩展的 Node.js 服务端应用框架，基于 TypeScript 编写并且结合了 OOP1、FP2、FRP3 的相关理念。
- **Typeorm**: 支持最新的 JavaScript 特性并提供额外的特性以帮助你开发任何使用数据库的应用程序。
- **ES6+**：采用ES6+语法，箭头函数、async/await等等语法很好用。
- **SASS(SCSS)**：用SCSS做CSS预处理语言，可以使用最高效的方式，以少量的代码创建复杂的设计。

### 数据库表结构设计
![](./assets/database.png)

### 环境配置
- 数据库mysql 以及 chat数据库
- node v10.16.3

### 运行项目
前端项目
```js
cd genal-chat-client 
npm run serve
```
后端项目
```js
cd genal-chat-server
npm run start:dev
```

### 系统迭代记录
> v1.0.0
##### 功能
- 新增用户
- 新增群
- 群聊
##### v1.0.0界面
![](./assets/1.png)

> v2.0.0
##### 功能
- 群聊/私聊
- 创建群/加入群聊/模糊搜索群
- 添加好友/模糊搜索好友
- 更改用户名/头像上传
- 表情包
- 消息分页
##### v2.0.0界面
![](./assets/2.png)

> v3.0.0
##### 功能
- 群聊/私聊
- 创建群/加入群聊/模糊搜索群
- 添加好友/模糊搜索好友
- 图片上传/粘贴发送图片/图片预览
- 更改用户名/头像上传
- 表情包
- 消息分页

### 作者
github： [edison](https://github.com/genaller)

### 如何部署
[阿童木聊天室部署说明](./阿童木聊天室部署说明.md)

### 更多细节
[nestjs+vue+ts打造一个酷炫的星空聊天室](https://github.com/genaller/strong-frontend/blob/master/learnNode/nest/%E8%81%8A%E5%A4%A9%E5%AE%A4/genal%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%85%B7%E4%BD%93%E5%AE%9E%E7%8E%B0.md)

