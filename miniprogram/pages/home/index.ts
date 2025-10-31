import { Apis } from '../../service/apiimpl';
import { Entities } from '../../service/entities'
const app = getApp()
app.BasePage({
    data: {
        ios: app.globalData.ios,
        containerHeight: 0,
        title: "钓点详情",
        detail: null,
        spotId: null,
        commentPageNum: 1 as number,
        commentPageSize: 10 as number,
        isCommentLoading: false,
    },

    onReady() {
        const systemInfo = wx.getSystemSetting()
        const windowHeight = systemInfo.windowHeight
        this.setData({
            containerHeight: windowHeight - 200 // 200是其他固定元素高度
        })
    },

    onLoad(options) {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        })

        const user = wx.getStorageSync("loginUser")
        const shared = options.from;
        this.setData({ loginUserId: user?.id, spotId: options.spotId,shared: shared === 'share' || shared === 'timeline' })
    },

    onShow() {
        this.loadUserSpot(this.data.spotId)
    },

    onImageError(e) {
        console.info("On image error.", e)
    },
    loadUserSpot(id) {
        Apis.loadUserSpot(id)
            .then(res => {
                this.setData({ detail: res });
            })
            .catch(err => {
                console.error('加载用户最新点位失败:', err);
            });
    },
 
    goFishingClicked() {
        const { spotId } = this.data.detail;
        if (!spotId) {
            wx.showToast({ title: '缺少spotId参数', icon: 'none' });
            return;
        }
        wx.navigateTo({
            url: `/pages/home/navigator/index?spotId=${encodeURIComponent(spotId)}`,
            fail: (err) => {
                console.error('跳转失败:', err);
                wx.showToast({ title: '跳转失败', icon: 'none' });
            }
        });
    },
    onHomeClicked(){
        wx.switchTab({
            url:"/pages/anybiting/index"
        })
    },
    onShowResults() {
        if (!this.data.detail?.spotId) {
            wx.showToast({ title: '缺少spotId参数', icon: 'none' })
            return
        }
        wx.navigateTo({
            url: '/pages/home/harvestpic/index?'
                + "spotId=" + `${this.data.detail.spotId}`
                + "&name=" + `${this.data.detail.name}`,
            fail: (err) => {
                console.error('页面跳转失败', err)
                wx.showToast({ title: '跳转失败', icon: 'none' })
            }
        })
    },
    async onCollectClicked() {
        if (!this.data.detail.isPrivate) {
            const result: Entities.DTO<Entities.CreditAvailable> = await Apis.checkCreditAvailable(this.data.detail.spotId);
            if (result.status) {
                if (result.data.isFulfill) {
                    wx.showModal({
                        title: '提示',
                        content: `查看秘密钓点,消耗积分${result.data.creditVal}`,
                        showCancel: true, // 是否显示取消按钮，默认为true
                        cancelText: '取消', // 取消按钮的文字，默认为"取消"
                        cancelColor: '#000000', // 取消按钮的文字颜色，默认为"#000000"
                        confirmText: '确定', // 确认按钮的文字，默认为"确定"
                        confirmColor: '#3cc51f', // 确认按钮的文字颜色，默认为"#3cc51f"
                        success: (res) => {
                            if (res.confirm) {
                                Apis.collectSpot(this.data.detail.spotId)
                                    .then(() => {
                                        wx.showToast({
                                            title: '收藏成功',
                                            icon: 'success',
                                            duration: 2000
                                        })
                                        this.onSpotDetailClick();
                                    })
                                    .catch(err => {
                                        console.error('收藏失败:', err)
                                        wx.showToast({
                                            title: '收藏失败',
                                            icon: 'none',
                                            duration: 2000
                                        })
                                    })
                            }

                        }
                    })
                } else {
                    wx.showToast({
                        title: `积分不够:${result.data.difference}`,
                        duration: 2000,
                        icon: 'none'
                    })
                }
            }
        } else {

            Apis.collectSpot(this.data.detail.spotId)
                .then(() => {
                    wx.showToast({
                        title: '收藏成功',
                        icon: 'success',
                        duration: 2000
                    })
                    this.onSpotDetailClick();
                })
                .catch(err => {
                    console.error('收藏失败:', err)
                    wx.showToast({
                        title: '收藏失败',
                        icon: 'none',
                        duration: 2000
                    })
                })
        }


    },
    onSpotDetailClick() {
        if (this.data.spotId != null) {
            this.loadUserSpot(this.data.spotId)
        } else {
            this._loadLatestSpot();
        }
    },

    showPictures(e) {
        const pics: string[] = e.currentTarget.dataset.pics || [];
        if (pics.length === 0) return;
        try {
            wx.previewImage({
                current: pics[0],
                urls: pics
            });
        } catch (error) {
            console.error('图片预览失败:', error);
        }
    },
    onSpotVisitersClick() {
        wx.navigateTo({
            url: `/pages/home/visitors/index?spotId=${this.data.detail.spotId}`
        })
    },
    onShareAppMessage(res) {
        return {
            title: '推荐你使用这个钓点小程序',
            path: `/pages/home/index?from=share&spotId=${this.data.detail.spotId ? this.data.detail.spotId : this.data.spotId}`,
            success(res) {
                if (res.shareTickets) {
                    console.log('shareTicket:', res.shareTickets[0]);
                }
            },
            fail(res) {
                console.log('转发失败', res);
            }
        }
    },

    onShareTimeline() {
        return {
            title: '发现一个好用的钓点小程序',
            query: `from=timeline&spotId=${this.data.detail.spotId ? this.data.detail.spotId : this.data.spotId}`,
            success: () => {
                wx.showToast({
                    title: '分享到朋友圈成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: (err) => {
                console.error('朋友圈分享失败', err)
                wx.showToast({
                    title: '分享失败',
                    icon: 'none'
                })
            }
        }
    },
})
