<template>

  <div class="login">
    <a-modal 
    title="登录" 
    :visible="showLoginModal"
    :closable='false'
    footer=''
    >
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请输入用户名!' }] },
            ]"
            placeholder="name"
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

@Component({
  computed: {
    ...mapGetters(['showLoginModal'])
  },
  methods: {
    ...mapMutations(['changeShowLoginModal'])
  }
})
export default class GenalLogin extends Vue {
  form: any = null;

  created() {
    this.form = this.$form.createForm(this, { name: 'normal_login' });
  }

  handleSubmit(e:any) {
    e.preventDefault();
    this.form.validateFields((err:any, values:any) => {
      if (!err) {
        this.$emit('login', values)
        // @ts-ignore
        this.changeShowLoginModal(false)
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
