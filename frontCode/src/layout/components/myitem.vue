<template>
  <div>
    <template v-for="(item, index) in data">
      <!-- isHidden值等于1才去显示，等于2隐藏 -->
      <template v-if="item.isHidden == 1">
        <!-- 因为有子集和无子集渲染html标签不一样，所以要分为两种情况：情况一：有子集的情况：-->
        <template v-if="item.children">
          <!-- 有子集去递归显示 -->
          <el-submenu :key="index" :index="item.url">
            <template slot="title">
              <i class="el-icon-platform-eleme"></i>
              <span>{{ item.name }}</span>
            </template>
            <myitem :data="item.children"></myitem>
          </el-submenu>
        </template>
        <!-- 情况二：没子集的情况 -->
        <template v-else>
          <!-- 没子集直接显示内容即可 -->
          <el-menu-item :key="index" :index="item.url">
            <i class="el-icon-eleme"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "myitem",
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  // 注意： 在template标签上使用v-for，:key="index"不能写在template标签上，因为其标签不会被渲染，会引起循环错误
};
</script>
