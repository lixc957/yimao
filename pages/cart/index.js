// pages/cart/index.js
import { 
  getSetting, 
  chooseAddress, 
  openSetting, 
  showModal,
  showToast } from '../../utils/asyncWx'
import '../../lib/runtime/runtime'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  onShow(){
    // 读取缓存中的数据
    const address = wx.getStorageSync("address") || {}
    const cart = wx.getStorageSync("cart") || []
    
    this.setData({
      address
    })
    this.setCart(cart)
  },

  // 点击收货地址
  async handleChooseAddress() {
    // 1.获取权限状态
    try {
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting['scope.address']
      // 2.判断权限状态
      if (scopeAddress === false) {
        await openSetting()
      }
      // 3.调用收货地址的api
      const address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 4.将地址存储到本地
      wx.setStorageSync("address", address)    
    } catch (error) {
      console.log(error)
    }
  },

  // 点击商品选中
  handeItemChange(e) {
    // 1.拿到商品id
    const { id } = e.currentTarget.dataset
    // 2.获取数据
    const cart = this.data.cart
    // 3.找到被修改的商品对象
    const index = cart.findIndex(v => v.goods_id === id)
    // 4.选中状态取反
    cart[index].checked = !cart[index].checked

    this.setCart(cart)
  },

  // 点击全选
  handleItemAllCheck() {
    // 1 获取data中的数据
    let { cart, allChecked } = this.data
    // 2 修改值
    allChecked = !allChecked
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked)
    // 4 把修改后的值 填充回data或者缓存中
    this.setCart(cart)
  },

  // 点击 + - 按钮
  async handleItemNumEdit(e){
    // 1.获取传递过来的参数 
    const { operation, id } = e.currentTarget.dataset
    // 2.获取购物车数组
    const { cart } = this.data
    // 3.找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 4.判断是否要执行删除
    if (cart[index].count === 1 && operation === -1) {
      const res = await showModal({ content: '是否删除商品？' })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      cart[index].count += operation
      this.setCart(cart)
    }
  },

  // 点击结算按钮
  async handlePay() {
    // 1.获取数据
    const { address, totalNum } = this.data
    // 2.判断收货地址
    if (!address.userName) {
      await showToast({ title: '请添加收货地址' })
      return
    }
    // 3.判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({ title: '请选购商品' })
      return
    }
    // 4.跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    })
      
  },

  // 购物车计算
  setCart(cart) {
    const allChecked = cart.length?cart.every(v => v.checked):false

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
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
  }
})
