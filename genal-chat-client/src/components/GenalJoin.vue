<template>

  <div class="login">
    <a-modal 
      header=''
      footer=''
      :visible="showModal"
      :closable='false'
    >
    <a-tabs default-active-key="1" @change="changeType">
      <a-tab-pane key="login" tab="登录">
      </a-tab-pane>
      <a-tab-pane key="regist" tab="注册" force-render>
      </a-tab-pane>
    </a-tabs>
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'username',
              { rules: [{ required: true, message: '请输入用户名!' }] },
            ]"
            placeholder="username"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              { rules: [{ required: true, message: '请输入密码!' }] },
            ]"
            type="password"
            placeholder="Password"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-checkbox
            v-decorator="[
              'remember',
              {
                valuePropName: 'checked',
                initialValue: false,
              },
            ]"
          >
            记住密码
          </a-checkbox>
          <a-button type="primary" html-type="submit" class="login-form-button">
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {mapMutations, mapGetters} from "vuex";

@Component
export default class GenalJoin extends Vue {
  @Prop() showModal:boolean;
  form: any = null;
  type: string = 'login'

  created() {
    this.form = this.$form.createForm(this, { name: 'normal_login' });
  }

  changeType(type: string) {
    this.type = type
  }

  handleSubmit(e:any) {
    e.preventDefault();
    this.form.validateFields((err:any, values:User) => {
      if (!err) {
        if(this.type === 'regist') {
          values.createTime = new Date().valueOf()
        }
        this.$emit(this.type,values)
      }
    });
  }
}
</script>
<style lang="scss" scoped>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>
