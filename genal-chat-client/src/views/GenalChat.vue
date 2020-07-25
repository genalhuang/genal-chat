<template>
  <div>
    <div class="chat">
      <div class='chat-part1'>
        <genal-tool
          @logout='logout'
        ></genal-tool>
      </div>
      <div class='chat-part2'>
        <genal-search
          @addGroup='addGroup'
          @joinGroup='joinGroup'
          @addFriend='addFriend'
          @setActiveRoom='setActiveRoom'
        >
        </genal-search>
        <genal-room @setActiveRoom='setActiveRoom'></genal-room>
      </div>
      <div class='chat-part3'>
        <genal-message @sendMessage='sendMessage'></genal-message>
      </div>
      <genal-join @regist='handleregist' @login="handlelogin" :showModal="showModal"></genal-join>
    </div>
    <canvas id="canvas" width="100%" height="100%"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GenalTool from '@/components/GenalTool.vue'
import GenalJoin from '@/components/GenalJoin.vue'
import GenalRoom from '@/components/GenalRoom.vue'
import GenalMessage from '@/components/GenalMessage.vue'
import GenalSearch from '@/components/GenalSearch.vue'
import { namespace } from 'vuex-class'
const appModule = namespace('app')
const chatModule = namespace('chat')
import { processReturn } from '@/utils/common.ts';

@Component({
  components: {
    GenalTool,
    GenalJoin,
    GenalRoom,
    GenalMessage,
    GenalSearch
  },
})
export default class GenalChat extends Vue {
  showModal = false;

  @appModule.Getter('user') user: User;
  @appModule.Mutation('clear_user') clearUser: Function;
  @appModule.Action('login') login: Function;
  @appModule.Action('regist') regist: Function;

  @chatModule.Getter('socket') socket: any;
  @chatModule.Getter('userGather') userGather: any;
  @chatModule.Getter('activeRoom') activeRoom: any;
  @chatModule.Mutation('set_active_room') _setActiveRoom: Function;
  @chatModule.Action('connectSocket') connectSocket: Function;
  @chatModule.Action('getGroupAndMessages') getGroupAndMessages: Function;
  @chatModule.Action('getFriendAndMessages') getFriendAndMessages: Function;

  created() {
    if(!this.user.userId) {
      this.showModal = true;
    } else {
      this.handleJoin()
    }
  }

  mounted() {
    this.runStarrySky()
  }

  // 登录
  async handlelogin(user: User) {
    let res = await this.login(user)
    if(res) {
      // 进入系统事件
      this.handleJoin()
    }
  }

  // 注册
  async handleregist(user: User) {
    let res = await this.regist(user)
    if(res) {
      // 进入系统事件
      this.handleJoin()
    }
  }

  // 进入系统初始化事件
  async handleJoin() {
    this.showModal = false;
    this.connectSocket()
  }

  // 发消息
  sendMessage(data: SendMessage) {
    console.log('sendMessage',data)
    if(data.type === 'group') {
      this.socket.emit('groupMessage', {
        userId: this.user.userId,
        groupId: this.activeRoom.groupId,
        content: data.message,
        time: new Date().valueOf()
      })
    } else {
      this.socket.emit('friendMessage', {
        userId: this.user.userId,
        friendId: this.activeRoom.userId,
        content: data.message,
        time: new Date().valueOf()
      })
    }

  }

  // 创建群组
  addGroup(groupName: string) {
    this.socket.emit('addGroup', {
      userId: this.user.userId,
      groupName: groupName,
      createTime: new Date().valueOf()
    })
  }

  // 加入群组
  joinGroup(groupId: string) {
    this.socket.emit('joinGroup', {
      userId: this.user.userId,
      groupId: groupId,
    })
    this.getGroupAndMessages()
  }

  // 添加好友
  addFriend(friendId: string) {
    console.log(this.user)
    this.socket.emit('addFriend', {
      userId: this.user.userId,
      friendId: friendId,
      createTime: new Date().valueOf()
    })
  }

  // 设置当前聊天窗
  setActiveRoom(room: Friend & Group) {
    this._setActiveRoom(room)
  } 

  // 注销
  logout() {
    this.clearUser()
    this.$router.go(0)
  }

  // 星空代码
  runStarrySky() {
      //Helpers
      function lineToAngle(x1:any, y1:any, length:any, radians:any) {
        var x2 = x1 + length * Math.cos(radians),
          y2 = y1 + length * Math.sin(radians);
        return { x: x2, y: y2 };
      }

      function randomRange(min:any, max:any) {
        return min + Math.random() * (max - min);
      }

      function degreesToRads(degrees:any) {
        return degrees / 180 * Math.PI;
      }

      //Particle
      var particle = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: 0,

        create: function (x:any, y:any, speed:any, direction:any) {
          var obj = Object.create(this);
          obj.x = x;
          obj.y = y;
          obj.vx = Math.cos(direction) * speed;
          obj.vy = Math.sin(direction) * speed;
          return obj;
        },

        getSpeed: function () {
          return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        },

        setSpeed: function (speed:any) {
          var heading = this.getHeading();
          this.vx = Math.cos(heading) * speed;
          this.vy = Math.sin(heading) * speed;
        },

        getHeading: function () {
          return Math.atan2(this.vy, this.vx);
        },

        setHeading: function (heading:any) {
          var speed = this.getSpeed();
          this.vx = Math.cos(heading) * speed;
          this.vy = Math.sin(heading) * speed;
        },

        update: function () {
          this.x += this.vx;
          this.y += this.vy;
        }
      };

      //Canvas and settings
      var canvas:any = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        stars:any = [],
        shootingStars:any = [],
        layers = [
          { speed: 0.15, scale: 0.2, count: 320 },
          { speed: 0.3, scale: 0.5, count: 50 },
          { speed: 0.5, scale: 0.75, count: 30 }
        ],
        starsAngle = 145,
        shootingStarSpeed = {
          min: 15,
          max: 20
        },
        shootingStarOpacityDelta = 0.01,
        trailLengthDelta = 0.01,
        shootingStarEmittingInterval = 2000,
        shootingStarLifeTime = 500,
        maxTrailLength = 300,
        starBaseRadius = 2,
        shootingStarRadius = 3,
        paused = false;

      //Create all stars
      for (var j = 0; j < layers.length; j += 1) {
        var layer = layers[j];
        for (var i = 0; i < layer.count; i += 1) {
          var star = particle.create(randomRange(0, width), randomRange(0, height), 0, 0);
          star.radius = starBaseRadius * layer.scale;
          star.setSpeed(layer.speed);
          star.setHeading(degreesToRads(starsAngle));
          stars.push(star);
        }
      }

      function createShootingStar() {
        var shootingStar = particle.create(randomRange(width / 2, width), randomRange(0, height / 2), 0, 0);
        shootingStar.setSpeed(randomRange(shootingStarSpeed.min, shootingStarSpeed.max));
        shootingStar.setHeading(degreesToRads(starsAngle));
        shootingStar.radius = shootingStarRadius;
        shootingStar.opacity = 0;
        shootingStar.trailLengthDelta = 0;
        shootingStar.isSpawning = true;
        shootingStar.isDying = false;
        shootingStars.push(shootingStar);
      }

      function killShootingStar(shootingStar:any) {
        setTimeout(function () {
          shootingStar.isDying = true;
        }, shootingStarLifeTime);
      }

      function update() {
        if (!paused) {
          context.clearRect(0, 0, width, height);
          context.fillStyle = "#282a3a";
          context.fillRect(0, 0, width, height);
          context.fill();

          for (var i = 0; i < stars.length; i += 1) {
            var star = stars[i];
            star.update();
            drawStar(star);
            if (star.x > width) {
              star.x = 0;
            }
            if (star.x < 0) {
              star.x = width;
            }
            if (star.y > height) {
              star.y = 0;
            }
            if (star.y < 0) {
              star.y = height;
            }
          }

          for (i = 0; i < shootingStars.length; i += 1) {
            var shootingStar = shootingStars[i];
            if (shootingStar.isSpawning) {
              shootingStar.opacity += shootingStarOpacityDelta;
              if (shootingStar.opacity >= 1.0) {
                shootingStar.isSpawning = false;
                killShootingStar(shootingStar);
              }
            }
            if (shootingStar.isDying) {
              shootingStar.opacity -= shootingStarOpacityDelta;
              if (shootingStar.opacity <= 0.0) {
                shootingStar.isDying = false;
                shootingStar.isDead = true;
              }
            }
            shootingStar.trailLengthDelta += trailLengthDelta;

            shootingStar.update();
            if (shootingStar.opacity > 0.0) {
              drawShootingStar(shootingStar);
            }
          }

          //Delete dead shooting shootingStars
          for (i = shootingStars.length - 1; i >= 0; i--) {
            if (shootingStars[i].isDead) {
              shootingStars.splice(i, 1);
            }
          }
        }
        requestAnimationFrame(update);
      }

      function drawStar(star:any) {
        context.fillStyle = "rgb(255, 221, 157)";
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
        context.fill();
      }

      function drawShootingStar(p: any) {
        var x = p.x,
          y = p.y,
          currentTrailLength = (maxTrailLength * p.trailLengthDelta),
          pos = lineToAngle(x, y, -currentTrailLength, p.getHeading());

        context.fillStyle = "rgba(255, 255, 255, " + p.opacity + ")";
        // context.beginPath();
        // context.arc(x, y, p.radius, 0, Math.PI * 2, false);
        // context.fill();
        var starLength = 5;
        context.beginPath();
        context.moveTo(x - 1, y + 1);

        context.lineTo(x, y + starLength);
        context.lineTo(x + 1, y + 1);

        context.lineTo(x + starLength, y);
        context.lineTo(x + 1, y - 1);

        context.lineTo(x, y + 1);
        context.lineTo(x, y - starLength);

        context.lineTo(x - 1, y - 1);
        context.lineTo(x - starLength, y);

        context.lineTo(x - 1, y + 1);
        context.lineTo(x - starLength, y);

        context.closePath();
        context.fill();

        //trail
        context.fillStyle = "rgba(255, 221, 157, " + p.opacity + ")";
        context.beginPath();
        context.moveTo(x - 1, y - 1);
        context.lineTo(pos.x, pos.y);
        context.lineTo(x + 1, y + 1);
        context.closePath();
        context.fill();
      }

      //Run
      update();

      //Shooting stars
      setInterval(function () {
        if (paused) return;
        createShootingStar();
      }, shootingStarEmittingInterval);

      window.onfocus = function () {
        paused = false;
      };

      window.onblur = function () {
        paused = true;
      };
  }
}
</script>
<style lang="scss" scoped>
.chat {
  font-size: 16px;
  color: #fff;
  z-index: 999;
  max-width: 1000px;
  width: 1000px;
  height: 800px;
  position: relative;
  margin: auto 20px;
  box-shadow: 6px 10px 10px rgb(153, 153, 153,.2);
  display: flex;
  border-radius: 5px;
  .chat-header {
    position: absolute;
    display: flex;
    right: 0;
    top: -50px;
  }
  .chat-part1 {
    width: 74px;
    background-color: rgb(21, 21, 21, .6);
  }
  .chat-part2 {
    width: 230px;
    background-color: rgb(21, 21, 21, .4);
  }
  .chat-part3 {
    flex: 1;
    background-color: rgb(21, 21, 21, .2);
    .chat-group {
      height: 53px;
      border-bottom: 1px solid #ccc;
      line-height: 50px;
      font-weight: bold;
    }
  }
}

#canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
