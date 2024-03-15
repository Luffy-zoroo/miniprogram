//app.js
App({
  //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
  onLaunch: function(options){
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-2g181f9k42bc6ef9',
        traceUser: true,
      })
    }
  },
  onShow: function(options){

  },
  onHide: function(){
    wx.getStorage({
      key: 'which',
      success: (res)=>{
        if(res.data=='ped'){
          const db = wx.cloud.database()
          db.collection('peds').doc('ped-1').remove()
        }
        else{
          WX.getStorage({
            key:'dri-id',
            success:(result)=>{
              const db = wx.cloud.database()
              // result.data
              db.collection('drivers').doc(result.data).remove
            }
          })
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  onError: function(msg){

  },
  //options(path,query,isEntryPage)
  onPageNotFound: function(options){

  },
  globalData:{
    idcode:""
  }

});
