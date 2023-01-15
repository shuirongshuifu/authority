<template>
  <div>
    <span>共用的动态组件：</span>
    <h2>
      根据 <span class="val">{{ val }}</span> 的不同发相应请求
    </h2>
  </div>
</template>

<script>
export default {
  data() {
    return {
      val: Object.values(this.$route.params)[0].slice(1),
      /*
        注意url的配置：
        思路是多个路由path使用同一个组件，需要加上监听，解决路由变了，组件不刷新的问题
            身份标识id直接url中拼接即可使用
            url:'xxx/:001'
      */
    };
  },
  watch: {
    $route: {
      handler: function () {
        this.val = Object.values(this.$route.params)[0].slice(1);
      },
    },
  },
};
</script>

<style>
.val {
  color: brown;
  font-size: 36px;
  margin: 0 8px;
}
</style>