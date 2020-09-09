// pages/order/index.js
import { request } from '../../request/index'
import '../../lib/runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ]
  },
  onShow(options){
    const token = wx.getStorageSync("token")
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return  
    }

    // 1.获取小程序的页面栈-数组，长度最大是10个页面
    let pages = getCurrentPages()
    // 2.数组中索引最大的就是当前页面
    let currentPage = pages[pages.length - 1]
    // 3.获取url上的type参数
    const { type } = currentPage.options 
    // 4.激活选中页面标题 当 type=1 index=0
    this.changeTitleByIndex(type-1)
  },
  async getOrders(type){
    const res = await request({
      url: '/my/orders/all',
      data: {type}
    })
    const orders = res.orders.map(v => ({
      order_id: v.order_id,
      order_number: v.order_number,
      order_price: v.order_price,
      create_time: new Date(v.create_time*1000).toLocaleString()
    }))
    this.setData({orders})  
  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    const { tabs } = this.data
    tabs.forEach((v, i) => {
      i===index?v.isActive=true:v.isActive=false
    })
    this.setData({tabs})
  },
  handleTabsItemChange(e) {
    const { index } = e.detail
    this.changeTitleByIndex(index)
    // 重新发送请求 type=1 index=0
    this.getOrders(index+1)
  }
})