const app = getApp()
app.BasePage({
    /**
     * 页面的初始数据
     */
    data: {},
  
   
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {},
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {},
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      // 可添加“下拉刷新检查是否上线”的逻辑
      setTimeout(() => {
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '暂未上线，敬请期待',
          icon: 'none'
        });
      }, 1000);
    }
  });