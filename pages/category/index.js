import { request } from '../../request/index'
import '../../lib/runtime/runtime'
// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单栏数据
    leftMenuList: [],
    // 右侧内容
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0
  },
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 2.获取本地存储中的数据
    const Cates = wx.getStorageSync('cates')
    // 3.判断
    if (!Cates) {
      // 不存在,发送请求
      this.getCates()
    } else {
      // 有旧的数据,定义过期时间 10s
      if (Date.now() - Cates.time > 1000 * 30) {
        // 重新发送请求
        this.getCates()
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data

        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContent = this.Cates[0].children

        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    
  },
  // 获取分类数据
  async getCates() {
    const res = await request({
      url: '/categories'
    })
    this.Cates = res

    // 1.把接口的数据存入到本地存储中
    wx.setStorageSync('cates', {
      time: Date.now(),
      data: this.Cates
    })

    // 构造左侧数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
      
    // 构造右侧数据
    let rightContent = this.Cates[0].children

    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 点击左侧菜单栏
  handleItemTap(e) {
    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
})