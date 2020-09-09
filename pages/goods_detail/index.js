import { request } from '../../request/index'
import '../../lib/runtime/runtime'
// pages/goods_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // 1.获取小程序的页面栈-数组，长度最大是10个页面
    let pages = getCurrentPages()
    // 2.数组中索引最大的就是当前页面
    let currentPage = pages[pages.length - 1]
    // 3.获取url上的参数
    let options = currentPage.options 
    const { goods_id } = options
    this.getGoodsDetail(goods_id)
  },

  // 点击收藏
  handleCollect() {
    let isCollect = false
    // 1.获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync('collect') || []
    // 2.判断当前商品是否被收藏
    let index = collect.findIndex(v => v.goods_id === this.data.goodsObj.goods_id)
    if (index !== -1) {
      // 3.已经收藏过
      isCollect = false
      collect.splice(index, 1)
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      })   
    } else {
      // 4.没有收藏
      isCollect = true
      collect.push(this.data.goodsObj)
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })  
    }
    // 5.存到缓存
    wx.setStorageSync('collect', collect)
    // 5 修改data中的属性  isCollect
    this.setData({isCollect})    
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: '/goods/detail',
      data: {
        goods_id
      }
    })
    // 1.获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync('collect') || []
    // 2.判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === goodsObj.goods_id)  
    this.setData({
      goodsObj: {
        goods_id: goodsObj.goods_id,
        goods_small_logo: goodsObj.goods_small_logo,
        pics: goodsObj.pics,
        goods_price: goodsObj.goods_price,
        goods_name: goodsObj.goods_name,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg')
      },
      isCollect
    })
  },

  // 点击轮播图放大预览
  handlepreviewImage(e) {
    let urls = this.data.goodsObj.pics.map(v => v.pics_mid)
    wx.previewImage({
      current: e.currentTarget.dataset.url, 
      urls 
    })
  },
  
  // 加入购物车
  handleCartAdd() {
    // 1.获取缓存中的数据
    let cart = wx.getStorageSync("cart") || []
    // 2.判断商品是否存在与购物车中
    let index = cart.findIndex(v => {
      return v.goods_id === this.data.goodsObj.goods_id
    })

    if (index === -1) {
      // 3.不存在,第一次添加
      this.data.goodsObj.count = 1
      this.data.goodsObj.checked = true
      cart.push(this.data.goodsObj)
    } else {
      // 4.已经存在,数量加1
      cart[index].count++
    }

    // 5.把购物车数据添加到缓存中
    wx.setStorageSync("cart", cart)
    // 6.弹框提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,     
    })
      
  }
})