export function getSetting() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      } 
    })     
  })
}

export function chooseAddress() {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      } 
    })     
  })
}

export function openSetting() {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      } 
    })     
  })
}

export function showModal({ content }) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })   
  })
}

export function showToast({ title }) {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon: 'none',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })   
  })
}

export function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })   
  })
}

// 微信支付
export function requestPayment(pay) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })   
  })
}