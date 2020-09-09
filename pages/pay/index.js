// pages/pay/index.js
import { request } from '../../request/index'
import '../../lib/runtime/runtime'
import { requestPayment, showToast } from '../../utils/asyncWx'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    choiceCart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    const address = wx.getStorageSync("address")
    const cart = wx.getStorageSync("cart")
    // 过滤购物车数组
    let { choiceCart } = this.data
    choiceCart = cart.filter(v => v.checked)

    // 商品总价格
    let totalPrice = cart.filter(item => item.checked).reduce((total, item) => {
      return total + item.goods_price * item.count
    }, 0).toFixed(2)

    // 商品总数量
    let totalNum = cart.filter(item => item.checked).reduce((total, item) => {
      return total + item.count
    }, 0)

    // 存到缓存
    wx.setStorageSync("cart", cart)

    this.setData({
      address,
      choiceCart,
      totalPrice,
      totalNum
    })

  },

  // 点击支付
  async handleOrderPay() {
   try {
      // 1.读取缓存中的token
    const token = wx.getStorageSync('token')
    // 2.判断有没有token
    if (!token) {
      wx.navigateTo({
        // 跳转到授权页面
        url: '/pages/auth/index'
      })
      return
    }
    // 3.创建订单
    const order_price = this.data.totalPrice // 商品总价格
    const consignee_addr = this.data.address.all // 收货地址
    const choiceCart = this.data.choiceCart // 订单数组
    let goods = []

    choiceCart.forEach(v => {
      goods.push({
        goods_id: v.goods_id,
        goods_number: v.count,
        goods_price: v.goods_price
      })
    })
    // 4.发送请求,获取订单编号
    const { order_number } = await request({
      method: 'POST',
      url: '/my/orders/create',
      data: {
        order_price,
        consignee_addr,
        goods
      }
    })
    // 5.发送请求,获取支付参数
    const { pay } = await request({
      method: 'POST',
      url: '/my/orders/req_unifiedorder',
      data: {
        // 订单编号
        order_number
      }
    })
    // 6.发起微信支付
    await requestPayment(pay)
    // 7.查询后台订单状态
    const res = await request({
      method: 'POST',
      url: '/my/orders/chkOrder',
      data: {
        // 订单编号
        order_number
      }
    })
    await showToast({title: '支付成功'})
    // 8.手动删除缓存中已经删除了的商品
    let newCart = wx.getStorageSync('cart')
    newCart = newCart.filter(v => !v.checked)
    wx.setStorageSync('cart', newCart)
    // 9.跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/index'
    })   
   } catch (error) {
    await showToast({title: '支付失败'})
   }
  }
})