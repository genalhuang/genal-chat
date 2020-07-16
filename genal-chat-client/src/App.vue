<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang='scss'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  overflow: hidden;
  background: url(~@/assets/2.jpg) no-repeat 50%;
  background-size: cover;
}
</style>
