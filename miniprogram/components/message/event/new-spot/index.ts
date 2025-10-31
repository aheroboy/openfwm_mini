// components/message/event/new-spot/index.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    message:{
      type: Object,
      value:{},
      observer: function(newVal) {
        // 监听message变化，更新isDarkTheme状态
        this.setData({
          isDarkTheme: wx.getStorageSync('darkTheme') || false
        });
      }
    },
    isDarkTheme: {
      type: Boolean,
      value: false
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件生命周期
   */
  lifetimes: {
    attached() {
      // 初始化暗黑模式状态
      this.setData({
        isDarkTheme: wx.getStorageSync('darkTheme') || false
      });
      // 监听暗黑模式变化
      this.themeChangeListener = wx.onThemeChange((result) => {
        this.setData({
          isDarkTheme: result.theme === 'dark'
        });
      });
    },
    detached() {
      // 移除监听
      if (this.themeChangeListener) {
        this.themeChangeListener();
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onNewSpotTab(){
      console.info(this.data.message.content.id)
      wx.navigateTo({
        url:"/pages/home/index?spotId="+ this.data.message.content.id
      })
    },
    // 查看钓点详情
    viewSpotDetails(e){
      e.stopPropagation(); // 阻止事件冒泡
      wx.navigateTo({
        url:"/pages/home/index?spotId="+ this.data.message.content.id
      })
    },
    // 预览图片
    previewImage(e){
      const current = e.currentTarget.dataset.src;
      const urls = this.data.message.content.pics;
      wx.previewImage({
        current: current,
        urls: urls
      })
    }
  }
})