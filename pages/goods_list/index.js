import { request } from '../../request/index'
import '../../lib/runtime/runtime'
// pages/goods_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  QueryParams: {
    query: '',
    cid: '',
    pagenum:  1,
    pagesize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || ''
    this.QueryParams.query = options.query || ''
    this.getGoodsList()
  },
  totalPages:1,

  tabsItemTap(e) {
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((v, i) => {
      i===index?v.isActive=true:v.isActive=false
    })
    this.setData({
      tabs
    })
  },

  // 请求商品列表数据
  async getGoodsList() {
    const res = await request({
      url: '/goods/search',
      data: this.QueryParams
    })
    // 保存商品总页数
    this.totalPages = Math.ceil(res.total / this.QueryParams.pagesize) 
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    // 关闭下拉刷新
    wx.stopPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面触底
   */
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据,已经到底
      wx.showToast({
        title: '已经到底啦^_^'
      })
        
    } else {
      // 有下一页数据
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  /**
   * 生命周期函数--监听下拉事件
   */
  onPullDownRefresh() {
    // 1.重置数组
    this.setData({
      goodsList: []
    })
    // 2.重置页码
    this.QueryParams.pagenum = 1
    // 3.重新发送请求
    this.getGoodsList()
  }
})