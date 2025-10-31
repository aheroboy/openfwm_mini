const app = getApp();
Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared'
  },

  /**
   * 组件的属性列表
   */
  properties: {
    // 外部样式类
    extClass: {
      type: String,
      value: ''
    },

    // 标题文本
    title: {
      type: String,
      value: ''
    },

    // 背景颜色
    background: {
      type: String,
      value: ''
    },

    // 文字颜色
    color: {
      type: String,
      value: ''
    },

    // 是否显示返回按钮
    back: {
      type: Boolean,
      value: true
    },

    // 是否显示加载状态
    loading: {
      type: Boolean,
      value: false
    },

    // 是否显示首页按钮
    homeButton: {
      type: Boolean,
      value: false
    },

    // 是否显示返回文本
    showBackText: {
      type: Boolean,
      value: false
    },

    // 返回文本内容
    backText: {
      type: String,
      value: '返回'
    },

    // 是否启用显示隐藏动画
    animated: {
      type: Boolean,
      value: true
    },

    // 是否显示导航栏
    show: {
      type: Boolean,
      value: true,
      observer: '_showChange'
    },

    // 返回的页面深度
    delta: {
      type: Number,
      value: 1
    },

    // 是否自定义样式
    customStyle: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ios: app.globalData.ios,
    displayStyle: '',
    safeAreaStyle: ''
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached() {
      this._initSafeAreaStyle();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始化安全区域样式
     */
    _initSafeAreaStyle() {
      wx.getSystemInfo({
        success: (res) => {
          const isAndroid = res.platform === 'android';
          const isDevtools = res.platform === 'devtools';
          const safeAreaTop = res.safeArea?.top || 0;

          // 计算右侧内边距，确保内容不被右上角按钮遮挡
          wx.getMenuButtonBoundingClientRect({
            success: (rect) => {
              const rightPadding = res.windowWidth - rect.left;
              const safeAreaStyle = `padding-right: ${rightPadding}px;`;

              this.setData({
                ios: !isAndroid,
                safeAreaStyle,
                // 为Android和开发工具设置安全区域顶部样式
                ...(isDevtools || isAndroid ? {
                  safeAreaStyle: `${safeAreaStyle} height: calc(var(--height) + ${safeAreaTop}px); padding-top: ${safeAreaTop}px`
                } : {})
              });
            }
          });
        }
      });
    },

    /**
     * 显示隐藏变化处理
     */
    _showChange(show: boolean) {
      const animated = this.data.animated;
      let displayStyle = '';

      if (animated) {
        displayStyle = `opacity: ${show ? '1' : '0'}; transition: opacity 0.3s ease;`;
      } else {
        displayStyle = `display: ${show ? '' : 'none'};`;
      }

      this.setData({
        displayStyle
      });
    },

    /**
     * 返回按钮点击事件
     */
    onBack() {
      const delta = this.data.delta;

      wx.navigateBack({
        delta
      });

      this.triggerEvent('back', { delta }, {});
    },

    /**
     * 首页按钮点击事件
     */
    onHome() {
      wx.switchTab({
        url: '/pages/home/index'
      });

      this.triggerEvent('home', {}, {});
    }
  },
});
