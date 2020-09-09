import { baseURL, request } from '../../request/index'
//Page Object
Page({
  data: {
    // 轮播图
    swiperList: [],
    // 分类导航
    cateList: [],
    // 楼层
    floorList: []
  },
  //options(Object)
  onLoad: function (options) {
    // 1.请求轮播图数据
    this.getSwiperData()

    // 2.请求分类导航数据
    this.getCateData()

    // 3.请求楼层数据
    this.getFloorData()
  },
  // 获取轮播图数据
  getSwiperData() {
    request({
      url: '/home/swiperdata'
    })
    .then(res => {
      const swiperList = res.map(v => ({
        goods_id: v.goods_id,
        image_src: v.image_src,
        navigator_url: v.navigator_url.replace('main', 'index')
      }))
      this.setData({
        swiperList
      })
    })
  },
  // 获取分类导航数据
  getCateData() {
    request({
      url: '/home/catitems'
    })
    .then(res => {
      this.setData({
        cateList: res
      })
    })
  },
  // 获取楼层数据
  getFloorData() {
    request({
      url: '/home/floordata'
    })
    .then(res => {
      let floorList = res.map(v => ({
        floor_title: v.floor_title,
        product_list: v.product_list.map(item => ({
          image_src: item.image_src,
          image_width: item.image_width,
          name: item.name,
          navigator_url: item.navigator_url.replace('/goods_list', '/goods_detail/index')
        }))
      }))
      this.setData({
        floorList
      })
    })
  }
})
