const app = getApp();
import {Apis} from '../../../service/apiimpl';
const NAV_CLASS = 'nav';

app.BasePage({
  data: {
    ios: app.globalData.ios,
    timeoutId: 0,
    spotsRs: <any>[],
    spotPageNum: 1,
    spotPageSize: 10,
    isSpotLoading: false,
  },
  onLoad() {
   this.onScrollToLower();
  },
  onScrollToLower() {
    const { spotPageNum, spotPageSize, spotsRs, isSpotLoading } = this.data;
    if (isSpotLoading) {
      return;
    }
    this.setData({ isSpotLoading: true });
    Apis.loadUserMgrSpots(spotPageNum, spotPageSize).then(res => {
      let newPageNum = spotPageNum;
      if (spotPageNum < res.pages) {
        newPageNum = spotPageNum + 1;
      }

      const preData = spotsRs.slice(0, spotPageSize * (spotPageNum - 1));
      this.setData({
        spotPageNum: newPageNum,
        isSpotLoading: false,
        spotsRs: [...preData, ...res.records]
      });
    }).catch(err => {
      console.info(err)
    })
  },

  onSpotPicking(e: any) {
    console.info(e)
    const spotId = e.currentTarget.dataset.val;
    if (!spotId) return;

    const pages = getCurrentPages();
    if (pages.length < 2) return;
    const prePage = pages[pages.length - 2];
    prePage.setData({ spotId: spotId });
    wx.navigateBack({ delta: 1 });
  },

  onSearch(e: { detail: { value: string } }) {
    this.setData({ loading: true });
    clearTimeout(this.data.timeoutId);
    this.data.timeoutId = setTimeout(() => {
      Apis.queryUserSpots(e.detail.value)
        .then((res) => {
          this.setData({ spotsRs: res });
        })
        .finally(() => {
          this.setData({ loading: false });
        });
    }, 1000);
  },
})
