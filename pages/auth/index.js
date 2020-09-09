// pages/auth/index.js
import { request } from '../../request/index'
import '../../lib/runtime/runtime'
import { login } from '../../utils/asyncWx'

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  async handleGetUserInfo(e) {
    try {
      // 1.获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail
      // 2.获取小程序登录成功后的code
      const { code } = await login()
      // 3.发送请求,获取用户的token
      /* const { token } = await request({
        method: 'post',
        url: '/users/wxlogin',
        data: {
          encryptedData,
          rawData,
          iv,
          signature,
          code,
        },
      }) */
      // 测试token
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      // 4.把token存到缓存中
      wx.setStorageSync('token', token)
      // 返回上一页
      wx.navigateBack({
        delta: 1
      })
    } catch (error) {
      // 返回上一页
      wx.navigateBack({
        delta: 1
      })
    }
  },
})
