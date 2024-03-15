//Page Object
Page({
  data: {
    latitude:"30.25961", 
    longitude:"120.13026",
    speed:"30",
    state:"暂时没有行人通过",
    type:"primary",
    ifCross:false,
    id:'',
    L:null
  },
  //options(Object)
  onLoad: function(options){//页面初次加载时执行的回调
    var that=this
    var ifCross=false
    wx.setStorage({
      key: 'notAgree',
      data: true
    });
    // console.log(ifCross)
    that.setData({
      ifCross:ifCross
    })
    const db = wx.cloud.database()
    // 监听行人请求
    const watcher = db.collection('peds').doc('ped-1').watch({
      onChange: function(res){
        // console.log('res');
        console.log('监听行人',res.docChanges);
        wx.showToast({
          title:'onChange'
        })
        // 监听变化成功
        // console.log('yes')\
        db.collection('peds').doc('ped-1').get({
          success:function(res){
            if(res.data.ifCross){
              wx.showToast({
                title:'ifcross true'
              })
              that.receive()
              // watcher.close()
            }
          }
        })
        // 司机监听某个行人的ifCross
      },
      onError:function(err){
        wx.showToast({
          title:'err'
        })
        console.error('监听因错误停止',err)
      }
    })
    // wx.startLocationUpdate({
    //   success:function(result){
    //     console.log(result);
    //     // const _locationChangeFn = function(res) {
    //     //  console.log(res);
    //     //  console.log('location change', res)
    //     // }
    //     // wx.onLocationChange(_locationChangeFn)
    //     // wx.offLocationChange(_locationChangeFn)
    //   }
    // })
    // wx.getLocation({
    //   type: 'gcj02',
    //   success (res) {
    //     //console.log(res);//打印实时定位        
    //     that.setData({
    //       latitude : res.latitude,
    //       longitude : res.longitude,
    //       speed : res.speed
    //     })
    //     wx.setStorage({
    //       key:'dri-location',
    //       data:[res.latitude,res.longitude]
    //     })
    //   }
    //  }) 
    
  },

  onShow: function(){
      var that=this
      // 保存初试定位
      wx.startLocationUpdate({ 
        success: (res) => {          
          wx.onLocationChange((data) => {
            var currentTime = new Date().getTime()
            var oldLocation = wx.getStorageSync('newlocation')
            var oldTime = wx.getStorageSync('oldTime')
            var newLocation = [data.latitude,data.longitude];//
            if(oldLocation!=newLocation){
              wx.setStorageSync('oldlocation',oldLocation)
              wx.setStorageSync('newlocation',newLocation);
              wx.setStorageSync('oldTime',currentTime);
              if(currentTime-oldTime>1000){
                that.setData({
                  latitude : data.latitude,
                  longitude : data.longitude,
                  speed : data.speed
                })     
              }
            }
            
          });
          console.log('startLocationUpdate-res', res)
        },
        fail: (err) => {
          that.setData({
            modalName: 'DialogModal1'
          });
        }
      })
      // that.data.L=setInterval(that.locate,10000)
      
    
      const db = wx.cloud.database()
      db.collection('drivers').add({
        data:{
          location_new:[that.data.latitude,that.data.longitude],
          location_old:null,
          speed_now:that.data.speed,
          ifAgree:false
        },
        success(res){
          wx.setStorage({
            key:'dri-id',
            data:res._id
          })
          that.setData({
            id:res._id
          })
        }

      })//司机向数据库存位置等变量
      // that.receive()
      wx.setStorage({
        key:'which',
        data:'driver'
      }) 
     
      // 调用数据库、  
    //传递数据，ifAgree为false
    // db.collection('drivers').add({
    //   data:{
    //     // _id:'id',
    //     ifAgree:false
    //   },
    // })
    
  },
  receive:function(){
    var that = this
    var ifCross
    var notAgree
    // console.log('then')
    const db = wx.cloud.database()
    wx.showToast({
      title:'receive'
    })
    db.collection('peds').doc('ped-1').get({
      success: function(res) {
        // res.data 包含该记录的数据
        // console.log(res.data.p_location[0])
        wx.showToast({
          title:'get'
        })
        if(res.data.ifCross){
          var p_lat=res.data.p_location[0]//行人维度
          var p_lon=res.data.p_location[1]//行人经度
          wx.showToast({
            title:'getlocation'
          })
          // console.log('ped'+res.data);//行人位置
          wx.getStorage({
            key:'newlocation',
            success(result){
              var distance=that.getDistance(result.latitude,result.longitude,p_lat,p_lon)
              console.log(distance)
              wx.showToast({
                title:'distance'
              })
              if(distance>30){
                // console.log('yes')
                wx.showToast({
                  title:'>30m'
                })
                that.agree()//距离大于30m直接同意通行
              }
              else{
                wx.showToast({
                  title:'<30m'//距离小于30m 判断趋近还是趋远
                })
                wx.getStorage({//
                  key: 'oldlocation',//
                  success: (e)=>{//
                    let lat=e.data[0]//
                    let lon=e.data[1]//
                    let old_d=that.getDistance(lat,lon,p_lat,p_lon)//
                    if(old_d<distance){//
                      wx.showToast({//
                        title:'old_d<distance'//
                      })//
                      that.agree()//
                    }//
                    else{//
                      wx.showToast({
                        title:'warn'
                      })
                      that.setData({
                        ifCross:true,
                        type:'warn',
                        state:'附近有行人要通过'
                      })
                      var warn=wx.createInnerAudioContext({})
                      warn.src='/voice/%u3002.mp3'
                      warn.play()
                    }//
                  }//
                });//
              }
            }
          })
          // wx.getLocation({
          //   type:'gcj02',
          //   success(result){
          //     // console.log('dri'+result.latitude,result.longitude);
          //     var distance=that.getDistance(result.latitude,result.longitude,p_lat,p_lon)
          //     console.log(distance)
          //     wx.showToast({
          //       title:'distance'
          //     })
          //     if(distance>30){
          //       // console.log('yes')
          //       wx.showToast({
          //         title:'>30m'
          //       })
          //       that.agree()//距离大于30m直接同意通行
          //     }
          //     else{
          //       wx.showToast({
          //         title:'<30m'//距离小于30m 判断趋近还是趋远
          //       })
          //       wx.getStorage({//
          //         key: 'oldLocation1',//
          //         success: (e)=>{//
          //           let lat=e.data[0]//
          //           let lon=e.data[1]//
          //           let old_d=that.getDistance(lat,lon,p_lat,p_lon)//
          //           if(old_d<distance){//
          //             wx.showToast({//
          //               title:'old_d<distance'//
          //             })//
          //             that.agree()//
          //           }//
          //           else{//
          //             wx.showToast({
          //               title:'warn'
          //             })
          //             that.setData({
          //               ifCross:true,
          //               type:'warn',
          //               state:'附近有行人要通过'
          //             })
          //             var warn=wx.createInnerAudioContext({})
          //             warn.src='/voice/%u3002.mp3'
          //             warn.play()
          //           }//
          //         }//
          //       });//
          //     }
          //   },
          //   fail(f){
          //     wx.showToast({
          //       title:'fail'
          //     })
          //   }
          // }) 
        }
      }
    })
    // wx.getStorage({
    //   key: 'ifCross',      
    //   success: (result)=>{
    //     ifCross=result.data
    //     that.setData({
    //       ifCross:ifCross
    //     })
    //     if(ifCross){
    //       that.setData({
    //         type:"warn",
    //         state:"附近有行人要通过"
    //       })          
    //     } 
    //     // wx.getStorage({
    //     //   key:'notAgree',
    //     //   success:(res)=>{
    //     //     notAgree=res.data
    //     //     if(notAgree){
    //     //       that.foragree()
    //     //     }
    //     //   }
    //     // })
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // }); 
    //console.log(ifCross)   
  },
  agree:function(){
    var that=this
    that.setData({
      ifCross:false,
    })
    // console.log(that.data.id)
    const db = wx.cloud.database()
    db.collection('drivers').doc(that.data.id).update({
      data:{
        ifAgree:true 
      }
    })
    // wx.setStorage({
    //   key:'ifCross',
    //   data:false
    // })
    wx.setStorage({
      key:'notAgree',
      data:false
    })
    wx.setStorage({
      key:'ifCross',
      data:false
    })
    that.setData({
      type:'primary',
      state:"暂时没有行人通过"
    }) 
    // wx.getStorage({
    //   key: 'ifCross',
    //   success (res) {
    //     console.log(res.data)
    //   }
    // })
    // wx.getStorage({
    //   key: 'notAgree',
    //   success (res) {
    //     console.log(res.data)
    //   }
    // })

  },
  // 计算距离函数
  Rad(d) { 
    //根据经纬度判断距离
    return d * Math.PI / 180.0;
  },
  getDistance(lat1, lng1, lat2, lng2) {
      // lat1用户的纬度
      // lng1用户的经度
      // lat2商家的纬度
      // lng2商家的经度
      var radLat1 = this.Rad(lat1);
      var radLat2 = this.Rad(lat2);
      var a = radLat1 - radLat2;
      var b = this.Rad(lng1) - this.Rad(lng2);
      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;
      s = Math.round(s * 10000) / 10;
      // s = s.toFixed(1) //保留两位小数
      // console.log('经纬度计算的距离:' + s)
      return s
  },
// ————————————————
// 版权声明：本文为CSDN博主「誩。」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
// 原文链接：https://blog.csdn.net/qq_44718678/article/details/107444383
  onHide: function(){
    var that=this
    const db = wx.cloud.database()
    db.collection('drivers').doc(this.data.id).remove()
    clearInterval(that.data.L)    
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