//Page Object
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickname:"",
    avatarUrl:""
  },
  //options(Object)
  // onLoad: function() {
  //   // 查看是否授权
  //   wx.getSetting({
  //     success (res){
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称
  //         wx.getUserInfo({
  //           success: function(res) {
  //             console.log(res.userInfo)
  //             wx.reLaunch({
  //               url: '/pages/mine/mine',
  //               success: (result)=>{
                  
  //               },
  //               fail: ()=>{},
  //               complete: ()=>{}
  //             });
  //           }
  //         })
  //         wx.reLaunch({
  //           url: '/pages/mine/mine',
  //           success: (result)=>{
              
  //           },
  //           fail: ()=>{},
  //           complete: ()=>{}
  //         });
  //       }
  //     }
  //   })
  // }
  bindGetUserInfo (e) {
    var that=this
    console.log(e.detail.userInfo)
    wx.setStorage({
      key: 'nickname',
      data: e.detail.userInfo.nickName,
    });
    wx.setStorage({
      key:'avatarUrl',
      data :e.detail.userInfo.avatarUrl,
    })
    wx.reLaunch({
      url: '/pages/mine/mine',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
});