// pages/search/index.js
import { request } from '../../request/index'
import '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    isFocus: false,
    inpValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  timer: -1,

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  handleInput(e) {
    const { value } = e.detail
    if (!value.trim()) {
      // 值不合法
      this.setData({
        goods: [],
        isFocus: false
      })
      return
    }
    // 防抖
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.qsearch(value)
    }, 500)
    this.setData({isFocus: true})
  },

  async qsearch(query) {
    const res = await request({
      url: '/goods/search',
      data: {query}
    })
    this.setData({
      goods: res.goods
    })
  },

  handleCancel() {
    this.setData({
      goods: [],
      isFocus: false,
      inpValue: ''
    })
  }
})