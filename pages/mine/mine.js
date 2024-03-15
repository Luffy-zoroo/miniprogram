// pages/mine/mine.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
        nickname:"点我登录",
        idcode:"",
        avatarUrl:"",
        info:false
  },
  onLoad: function(options){
    
  },
  onReady: function(){
    this.setData({
      nickname:this.data.nickname       
    })
    this.setData({
      avatarUrl:this.data.avatarUrl
    })
  },
  onShow: function(){
    var that=this
    // wx.getStorage({
    //   key: 'nickname',
    //   success: (result)=>{
    //     that.data.nickname=result.data
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });
    // wx.getStorage({
    //   key:'avatarUrl',
    //   success:(result)=>{
    //     that.data.avatarUrl=result.data
    //   }
    // })
  },//显示授权的昵称和头像
  bindsignin: function (e){  
    let that=this
    wx.login({
      //timeout:10000,
      success: (res)=>{
        console.log(res);
      },
      fail: ()=>{},
      complete: ()=>{}
    }); 
    // wx.redirectTo({
    //   url: '/pages/login/index',
    // });
    that.setData({
      info:true
    })
  }
})
  

