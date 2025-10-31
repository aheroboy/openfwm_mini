import { Apis } from "../../service/apiimpl"
import { Entities} from '../../service/entities'
const app = getApp();
app.BasePage({

    /**
     * 页面的初始数据
     */
    data: {
        // 渔获记录数据
        fishingRecord: {} as Entities.FishingRecord,
        // 当前图片索引
        currentIndex: 1,
        // 页面加载状态
        isLoading: false,
        shared: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 模拟评论数据
        wx.showShareMenu({
            withShareTicket: true, // 开启分享后获取shareTicket
            menus: ['shareAppMessage', 'shareTimeline'] // 指定支持的分享类型
        });
        const shared = options.from;
        this.setData({shared: shared === 'share' || shared === 'timeline' })
        console.info(options,shared)
        Apis.loadHarvest(options.id).then(res => {
            const record = res;
            record.fishesStr = record.fishes.map(f => f.name).join('、');
            this.setData(
                {
                    fishingRecord: record,
                    likeCount: record.likeCount || 0,
                    isLiked: record.isLiked || false
                }
            )
        })
    },

    // 跳转到钓点详情
    goToSpotDetail() {
        const { spotId } = this.data.fishingRecord;
        wx.navigateTo({
            url: `/pages/home/index?spotId=${spotId}`
        });
    },

    previewImage(e: WechatMiniprogram.TouchEvent) {
        const pics = this.data.fishingRecord.jsonHisPictures;
        if (pics?.length < 1) {
            return;
        }
        wx.previewImage({
            current: e.currentTarget.dataset.img || pics[0],
            urls: pics
        });
    },

    // 分享功能
    onShareAppMessage() {
        return {
            title: '这渔获怎样?',
            path: `/pages/show/index?from=share&id=${this.data.fishingRecord.id}`,
            success(res) {
                console.log('分享成功', res);
                wx.showToast({
                    title: '分享成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail(res) {
                console.error('分享失败',res)
                wx.showToast({
                    title: '分享失败',
                    icon: 'none'
                })
            }
        };
    },
    onShareTimeline() {
        return {
            title: '这渔获怎样?',
            query: `from=timeline&id=${this.data.fishingRecord.id}`,
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
    onHomeClicked(){
        wx.switchTab({
            url:"/pages/anybiting/index"
        })
    },
    onSwiperChange(e: WechatMiniprogram.SwiperChange) {
        this.setData({
            currentIndex: e.detail.current + 1
        });
    }
})