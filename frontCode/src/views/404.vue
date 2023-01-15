<template>
  <div class="fourZeroFour">
    <h1>找不到这个页面😭</h1>
    <br />
    <el-button size="mini" @click="goHome" type="primary">返回首页</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.replace({ path: "/home" });
    },
  },
};
</script>

<style>
.fourZeroFour {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>