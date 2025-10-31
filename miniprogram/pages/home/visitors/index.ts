const app = getApp();
import {Apis} from '../../../service/apiimpl';
app.BasePage({

  data: {
    ios: app.globalData.ios,
    title: "渔获",
    spotId: null,
    pageNum:1,
    pageSize:10,
    visitors: [],
  },
  onLoad(options) {
    this.calculateMainHeight();
    this.setData({ spotId: options.spotId });
    this.loadMore();
  },
  goHarvest(e){
    console.info(e)
    wx.navigateTo({
        url:`/pages/show/index?id=${e.currentTarget.dataset.id}`
    })
  },
  loadMore() {
    const { pageNum, pageSize, visitors, isLoading,spotId } = this.data;
    if (isLoading) {
      return;
    }
    this.setData({ isLoading: true });
    Apis.loadSpotVisiters(pageNum, pageSize, spotId).then(res => {

      let newPageNum = pageNum;
      if (pageNum < res.pages) {
        newPageNum = pageNum + 1;
      }

      //永远获取到最后一页为止的数据（不包含最后一页）
      const preData = visitors.slice(0, pageSize * (pageNum - 1));
      this.setData({
        pageNum: newPageNum,
        isLoading: false,
        visitors: [...preData, ...res.records]
      });
    }).catch(err => {
      console.info(err)
    })
  },
  calculateMainHeight() {
    const query = wx.createSelectorQuery();
    query.select('.nav').boundingClientRect();
    query.exec(res => {
      const headerHeight = res[0].height;
      const windowHeight = wx.getStorageSync('wh');
      this.setData({
        mainHeight: windowHeight - headerHeight
      });
    });
  },
  onHarvestPicClicked(e: any) {
    console.info(e)
    const arr = e.currentTarget.dataset.urls as string[];
    const targetUrl = e.target.dataset.current as string;
    wx.previewImage({
      current: targetUrl,
      urls: arr
    });
  }
})