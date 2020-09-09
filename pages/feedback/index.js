// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
    // 文本域的内容
    textVal: ''
  },

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

  timer: -1,
  // 外网的图片的路径数组
  UpLoadImgs: [],

  // 点击 + 号
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    })  
  },

  // 删除图片
  handleRemoveImg(e) {
    const { index } = e.currentTarget.dataset
    const { chooseImgs } = this.data
    chooseImgs.splice(index, 1)
    this.setData({chooseImgs})
  },

  // 文本域输入事件
  handleTextInput(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.setData({
        textVal: e.detail.value
      })
    }, 500)    
  },

  // 点击提交按钮
  handleFormSubmit() {
    const { textVal, chooseImgs } = this.data
    // 文本不合法
    if (!textVal) {
      wx.showToast({
        title: '请输入反馈内容',
        icon: 'none',
        mask: true
      })
      return
    }

    // 合法，上传图片
    // 上传文件的 api 不支持 多个文件同时上传  遍历数组 挨个上传
    if (chooseImgs.length != 0) {
      wx.showLoading({
        title: "正在上传中",
        mask: true
      })

      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          filePath: v,
          name: "file",
          formData: {},
          success: (result) => {
            console.log(result)
          }
        })

        // 所有图片上传完毕触发
        if (i === chooseImgs.length - 1) {
          wx.hideLoading()
          console.log('上传成功')

          // 重置页面
          this.setData({
            textVal: '',
            chooseImgs: []
          })

          // 返回上一个页面
          wx.navigateBack({
            delta: 1
          })
        }
          
      })
    } else {
      console.log("只是提交了文本")
    }

  }
})