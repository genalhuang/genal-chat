import Vue from 'vue';
import 'ant-design-vue/dist/antd.less';
import { message, Button, Input, Modal, Form, Checkbox, Icon } from 'ant-design-vue';

Vue.use(Button);
Vue.use(Input);
Vue.use(Modal);
Vue.use(Form);
Vue.use(Checkbox);
Vue.use(Icon);
Vue.prototype.$message = message;
