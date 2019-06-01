<template>
  <div id="app">
    <!-- 视图容器 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app{
  /* 设置相对定位 */
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
