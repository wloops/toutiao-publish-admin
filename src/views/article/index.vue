<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
          </el-breadcrumb>
        <!-- 面包屑路径导航  end -->
      </div>

        <!-- 数据筛选表格 -->
        <el-form ref="form" :model="form" label-width="60px" size="mini">
          <el-form-item label="状态：">
            <el-radio-group v-model="status">
              <!--
                el-radio 默认把 label 作为
                文本和选中之后的 value 值
               -->
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="2">审核通过</el-radio>
              <el-radio :label="3">审核失败</el-radio>
              <el-radio :label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道：">
            <el-select v-model="channelID" placeholder="请选择频道">
              <el-option
              label="全部"
              :value="null"
              ></el-option>
              <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期：">
            <el-date-picker
              v-model="rangeDate"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <!--
              button 按钮的 click 事件有个默认参数
              当你没有指定参数的时候,它会默认传递一个没用的数据
             -->
            <el-button
            type="primary"
            :disabled="loading"
            @click="loadArticles(1)"
            >筛选</el-button>
          </el-form-item>
        </el-form>
        <!-- 数据筛选表格 end -->
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到 {{ totalCount }} 条结果：
      </div>
      <!-- 数据列表 -->
      <!-- table 表格
      1. 把需要展示的数组列表数据绑定给 table 组件的 data 属性
            注意: 不用v-for 遍历,它自己会遍历
      2. 设置表格列  el-table-column
          width 可以设定表格列的宽度
          label 可以设定列的标题
          prop 用来设定要渲染的列表项数据字段,只能展示文本
      3. 表格列默认只能渲染普通文本,如果要展示其他内容,例如放个按钮,放个图片,那就需要自定义表格列模板了:
          参考文档:https://element.eleme.cn/#/zh-CN/component/table#zi-ding-yi-lie-mo-ban
       -->
      <el-table
        :data="articles"
        style="width: 100%"
        class="list-table"
        stripe
        size="mini"
        v-loading="loading"
      >
        <el-table-column
          prop=""
          label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: 60px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy>
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <!-- <img v-if="scope.row.cover.images[0]" class="article-cover" :src="scope.row.cover.images[0]" alt="">
            <img v-else class="article-cover" src="./pic_bg.png" alt=""> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题">
        </el-table-column>
        <el-table-column
          label="状态">
          <!-- 如果需要在自定义列模板中获取当前遍历项数据,
          那么就在 template 上声明:
          slot-scope="scope"
          scope.row 获取当前遍历项对象-->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
            <!-- <el-tag v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag type="warning" v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="success" v-else-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag type="info" v-else-if="scope.row.status === 4">已删除</el-tag>  -->
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
              ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 数据列表 end -->

    <!-- 数据列表分页 -->
    <!--
      total 用来设定中数据的条数
      它默认按照 10 条每页计算总页码
      page-size 每页显示条目个数，支持 .sync 修饰符 默认每页 10 条
     -->
    <el-pagination
      layout="prev, pager, next"
      background
      :total="totalCount"
      :page-size="pageSize"
      :disabled="loading"
      :current-page.sync="page"
      @current-change="onCurrentChange"
      >
    </el-pagination>
    <!-- 数据列表分页 end -->
    </el-card>
  </div>
</template>

<script>
import {
  getArticle,
  getArticleChannels,
  deleteArticle
} from '@/api/article'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [], // 文章数据列表
      articleStatus: [
        { status: 0, text: '草稿', type: '' },
        { status: 1, text: '待审核', type: 'warning' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'danger' },
        { status: 4, text: '已删除', type: 'info' }
      ],
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页数量
      status: null, // 根据文章的状态查询, 不传就是查全部
      channels: [], // 文章频道列表
      channelID: null, // 查询文章的频道id
      rangeDate: null, // 筛选的范围日期
      loading: true, // 表单数据加载中 loading
      page: 1 // 当前页码
    }
  },
  computed: {},
  watch: {},
  created () {
    // 加载时调用
    this.loadChannels() // [频道]
    this.loadArticles(1) // [文章数据]默认传个 1 ,看第一页的数据
  },
  mounted () {},
  methods: {
    loadChannels () {
      getArticleChannels().then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
      })
    },
    loadArticles (page = 1) {
    // page = 1 也可以设置默认页码
    // 每次请求时,展示加载中的loading
      this.loading = true
      getArticle({
        page, // page: page  第几页
        per_page: this.pageSize, // 总页码
        status: this.status, // 文章状态
        channel_id: this.channelID, // 频道id
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期 不传就不限定开始时间  判断有值还是为空
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截至日期 不传就不限定结束时间
      }).then(res => {
        // console.log(res)
        // 重复部分可解构
        // total_count: totalCount 重命名-->由于代码格式检验规范限制只能用驼峰命名法
        const { results, total_count: totalCount } = res.data.data
        // this.articles = res.data.data.results
        // this.totalCount = res.data.data.totalCount
        this.articles = results // 数据列表
        this.totalCount = totalCount // 列表分页的总数

        // 关闭加载中 loading
        this.loading = false
      })
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    onDeleteArticle (articleID) {
      console.log(articleID)
      this.$confirm('确认删除该文章吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认删除后的处理
        deleteArticle(articleID.toString()).then(res => {
          // console.log(res)
          // 删除成功，更新当前页的文章数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
      // console.log('删了')
    }
  }
}
</script>

<style scoped lang="less">
.filter-card {
  margin-bottom: 20px;
}

.list-table {
  margin-bottom: 20px;
}

.article-cover {
  width: 100px;
  background-size: cover;
}
</style>
