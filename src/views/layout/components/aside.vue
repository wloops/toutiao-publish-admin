<template>
<el-menu
    default-active="/"
    background-color="#002033"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapsed">
    <el-menu-item index="/">
    <i class="el-icon-s-home"></i>
    <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
    <i class="el-icon-s-grid"></i>
    <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
    <i class="el-icon-picture"></i>
    <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="publish">
    <i class="el-icon-s-promotion"></i>
    <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
    <i class="el-icon-s-comment"></i>
    <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
    <i class="el-icon-s-custom"></i>
    <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
    <i class="el-icon-s-tools"></i>
    <span slot="title">个人设置</span>
    </el-menu-item>
</el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  components: {},
  props: ['is-collapsed'],
  data () {
    return {
      // isCollapsed: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style scoped lang="less"></style>
