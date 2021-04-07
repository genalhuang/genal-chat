### 阿童木聊天室部署说明
#### 部署前端服务
1. 打包前端文件生成 dist 文件夹
```js
  // genal-chat-client
  npm i
  npm run build 
```
1. 将 dist 下所有文件放到 nginx 下的 html 文件夹中
2. 配置 nginx 的 gzip (提高传输速度)和请求级别（注意只是新增下面的代码，不是替换整个nginx文件）
```js
// nginx.conf
http {
  include mime.types; 
  #nginx开启gzip
  #前端文件在build的时候已经配置好压缩,需要再配置一下nginx;
  gzip on; 
  gzip_static on;
  gzip_buffers 4 16k;
  gzip_comp_level 5;
  gzip_types text/plain application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg 
              image/gif image/png;
  
  #nginx请求级别配置
  server {
    listen       80;
    server_name  www.genal.fun;
    location / {
      root   html;
      index  index.html index.htm;
      add_header Cache-Control public;
    }

    location ^~/api/ {
      rewrite ^/api/(.*) /$1 break;
      proxy_pass http://localhost:3000;
    }

    location ^~/socket.io/ {
      proxy_pass http://localhost:3000;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }
  }  
}
```
3. 记得重启一下nginx

#### 数据库配置
1. 安装 mysql
2. 设置 mysql 账号密码
3. 创建名为 `chat` 的数据库
4. 配置后端 `app.module.ts` 中的 mysql 账号密码
```js
// genal-chat-server/src/app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      username: 'root', // 默认账号
      password: '123456', // 默认密码
      database: 'chat',
      charset: "utf8mb4",
      autoLoadEntities: true,
      synchronize: true
    }),
  ],
})
```

#### 部署后端服务
1. 安装 pm2
```js
// genal-chat-server
npm i pm2 -g
```
2. 生成 dist 文件
```js
// genal-chat-server
npm i
npm run build
```
3. 使用 pm2 运行
```js
// genal-chat-server
npm run pm2
```
**ps**: 如果运行不起来可以运行`npm run start:dev`看看是否有错误, 一般是mysql账号密码不对或者mysql版本太高, 如果是mysql版本问题可以看看这篇文章[https://blog.csdn.net/qq_41831345/article/details/83150502](https://blog.csdn.net/qq_41831345/article/details/83150502)

#### 最后
感谢部署! 🤪
