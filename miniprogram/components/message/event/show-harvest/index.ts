// components/message/event/show-harvest/index.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    message:{
      type: Object,
      value:{},
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
   * 组件的方法列表
   */
  methods: {


    // 查看渔获详情
    onShowHarvestTap() {
      wx.navigateTo({
        url: `/pages/show/index?id=${this.data.message.content.id}`
      });
    },

    // 查看钓点详情
    viewSpotDetails(e) {
      e.stopPropagation();
      wx.navigateTo({
        url: `/pages/home/index?spotId=${this.data.message.content.spotId}`
      });
    }
  }
})