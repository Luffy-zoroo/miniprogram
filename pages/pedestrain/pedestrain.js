//Page Object
Page({
  data: {
    latitude:"30.25961", 
    longitude:"120.13026",
    speed:"",
    ped:"请求通过",
    p:null
  },
  //定位回调
  locate:function(e){
    var that=this
    wx.getLocation({
      type: 'gcj02',
      success (res) {
        console.log(res);//打印实时定位        
        that.setData({
          latitude : res.latitude,
          longitude : res.longitude,
          speed : res.speed
        })
        // console.log(that.data.latitude)
        wx.showToast({
          title: '定位成功',
        })
        wx.setStorage({
          key: 'ped-location',
          data: [that.data.latitude,that.data.longitude],
          // success: (result)=>{
            
          // },
          // fail: ()=>{},
          // complete: ()=>{}
        });
      }
     })
    //  console.log(that.data.longitude) 
     
     
  },//定位回调结束
  //发出通过请求回调
  cross:function(){
    var that=this
    // console.log(that.data.latitude)
    const db = wx.cloud.database()
    db.collection('peds').doc('ped-1').update({//更新数据库
      data:{
        p_location:[that.data.latitude,that.data.longitude],//更新实时位置
        ifCross:true//改变通过状态
       },
       //修改数据库里面的ifcross
      success:function(res){
        wx.showToast({
          title: '发起请求成功，请耐心等待',
        })//得恢复的注释
      },
      fail:function(res){
        wx.showToast({
          title: '发起请求失败，请检查登录状态或联系客服解决',
        })
      }
    })
    
    wx.setStorage({
      key:'ifCross',
      data:true
    })
    
    that.setData({//改变页面状态
      ifCross:true,
      ped:"正在请求通过..."
    })
    // that.data.p=setInterval(that.ifAgree,5000)
    that.ifAgree()//开始监听驾驶人是否同意让行
  },//发出通过请求回调
  //options(Object)
  ifAgree:function(){
    var that=this
    const db = wx.cloud.database()
    const watcher=db.collection('drivers').where({//监听驾驶人集合变化
      ifAgree:false//监听条件ifAgree：false
    })
    .watch({
      onChange:function(snapshot){
        console.log(snapshot.docs.length)//有多少个驾驶人的ifAgree是false
        if(snapshot.docs.length==0){//如果没有false，都同意让行了
          wx.showToast({
            title:'可以通过了！'
          })
          that.setData({
            ped:'请求通过' 
          })//恢复之前页面
          db.collection('peds').doc('ped-1').update({
            data:{
              ifCross:false//变回初始状态
            }
          })
        }
        else{//否则显示还有几辆车未同意让行
          // that.data.p=setInterval(
            wx.showToast({
              title:'还有'+snapshot.docs.length+'辆车未让行'
            })//,3000
          // )
          console.log('还有'+snapshot.docs.length+'辆车未让行')
        }
      },
      onError:function(err){
        console.log('出错了',err)
        
      }
    })
    // .get({
    //   success:function(res){
    //     // console.log(res.data.length);
    //     if(res.data.length==0){
    //       // console.log('have');
    //       clearInterval(that.data.p)
    //       wx.showToast({
    //         title:'可以通过了！'
    //       })
    //       that.setData({
    //         ped:'请求通过' 
    //       })
    //       db.collection('peds').doc('ped-1').update({
    //         data:{
    //           ifCross:false
    //         }
    //       })
    //     }
    //     else{
    //       that.data.p=setInterval(
    //         wx.showToast({
    //           title:'还有'+res.data.length+'辆车未让行'
    //         }),100
    //       )
    //       console.log('还有'+res.data.length+'辆车未让行')
    //     }
    //   },
    //   fail: console.error
    // })
    // wx.getStorage({
      
    //   key: 'notAgree',
    //   success: (res)=>{
    //     if(!res.data){
    //       wx.showToast({
    //         title:'可以通过了！'
    //       })
    //       that.setData({
    //         ped:'请求通过 '
    //       })
    //     }
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });
  },

  onLoad: function(options){//setdata渲染
    var that=this
    that.setData({
      ifCross:false,
      ped:that.data.ped
    })
    wx.setStorage({
      key:"ifCross",
      data:false
    })
    // const db = wx.cloud.database()
    // db.collection('peds').add({
    //   data:{
    //     _id:'ped-1',
    //     p_location:[that.data.latitude,that.data.longitude],
    //     ifCross:false
    //   },
    // })
  },
  onReady: function(){
    
  },
  onShow: function(){
    var that=this
    const db = wx.cloud.database()
    db.collection('peds').add({//创建行人数据
      data:{
        _id:'ped-1',
        p_location:[that.data.latitude,that.data.longitude],//初始位置
        ifCross:false//初试状态
      },
    })
    wx.setStorage({
      key:'which',
      data:'ped'
    })
    //实时更新行人位置并在地图上显示
    wx.startLocationUpdate({ //开始监听实时位置
      success: (res) => {          
        wx.onLocationChange((data) => {//位置改变的回调
          console.log('locationchange')
          var pedLocation = [data.latitude,data.longitude];//更新位置信息并储存
          wx.setStorage({
            key:'ped-location',
            data:pedLocation
          })
          that.setData({//位置数据发送给地图
            latitude : data.latitude,
            longitude : data.longitude,
            speed : data.speed
          })     
        });
        console.log('startLocationUpdate-res', res)
      },
      fail: (err) => {
        console.log(err);
      }
    }) 
  },
  onHide: function(){
    const db = wx.cloud.database()
    db.collection('peds').doc('ped-1').remove()
  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){

  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  }
});