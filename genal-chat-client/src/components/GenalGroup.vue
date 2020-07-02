<template>
  <div class="group">
    <div v-for="(item,index) in groups" :key="index">
      <div
        class="group-card"
        :class="{'active': group === item.group}"
        @click="changeGroup(item.group)"
      >
        <div class="group-card-name">{{item.group}}</div>
        <div class="group-card-new">
          <span class="name" v-if="item.name">{{item.name}}:</span>
          <span class="text" v-if="item.newMessage">{{item.newMessage}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex'

@Component
export default class GenalGroup extends Vue {
  @Prop({ default: () => [] }) groups: GroupDto[];
  @Prop({ default: '' }) group: string;

  changeGroup(group: string) {
    this.$emit('changeGroup', group)
  }
}
</script>
<style lang="scss" scoped>
  .group {
    height: 100%;
    overflow: auto;
    .group-card {
      min-height: 52px;
      background-color: rgb(233, 233, 233);
      /*margin: 5px;*/
      width: 200px;
      margin-bottom: 1px;
      padding: 5px 10px;
      text-align: left;
      transition: all 0.2s linear;
      cursor: pointer;
      &:hover {
        background-color: #ccc;
      }
      &.active {
        background-color: #ccc;
      }
      .group-card-name {
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换行
        font-weight: bold;
      }
      .group-card-new {
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换行
        color: #878987;
        .name {
        }
        .text {
          margin-left: 5px;
        }
      }
    }
  }
</style>
