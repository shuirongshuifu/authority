<template>
  <div>
    <span>
      <svg
        class="logo"
        viewBox="0 0 128 128"
        width="24"
        height="24"
        data-v-e0ef77de=""
      >
        <path
          fill="#42b883"
          d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z"
          data-v-e0ef77de=""
        ></path>
        <path
          fill="#35495e"
          d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z"
          data-v-e0ef77de=""
        ></path>
      </svg>
    </span>
    <br />
    <br />
    <el-button type="primary" v-btn="{ vue页面: '新增vue' }">新增vue</el-button>
    <el-button type="primary" v-btn="{ vue页面: '编辑vue' }">编辑vue</el-button>
    <el-button type="danger" v-if="isShowDeleteBtn">删除vue</el-button>
  </div>
</template>

<script>
import { getBtnAuth } from "@/utils";
export default {
  name: "CodeVue",
  data() {
    return {};
  },
  computed: {
    isShowDeleteBtn() {
      // console.log(111, getBtnAuth("vue页面", "删除vue"));
      return getBtnAuth("vue页面", "删除vue");
    },
  },
};
</script>

<style lang="less" scoped></style>
