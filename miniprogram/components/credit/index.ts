// components/credit/index.ts
import { Apis } from '../../service/apiimpl';
import { Entities } from '../../service/entities'
const app = getApp();
Component({

    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        // 等级信息
        ios: app.globalData.ios,
        credit: {} as Entities.UserCredit
    },

    lifetimes: {
        attached: function () {
            this._loadUserCredit();
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        _loadUserCredit() {
            Apis.getUserCredit().then(res => {
                this.setData({ credit: res });
            })
        },
        goToLevelDetails() {
            wx.navigateTo({
                url: '/pages/my/credit-lvl/index?lvl=' + this.data.credit.currentLevel
            });
        },
        goToGetPoints(){
            wx.navigateTo({
                url: '/pages/my/credit-rules/index'
            });
        },
        /**
         * 跳转到全部积分记录页
         */
        goToAllPoints() {
            wx.navigateTo({
                url: '/pages/my/credit-record/index'
            });
        },

        /**
         * 自动跳过广告设置变更
         */
        onAutoSkipAdChange() {
            const credit = this.data.credit;
            const val = !credit.autoSkipAds;
            credit.autoSkipAds = val;
            this.setData({
                credit: credit
            });
            Apis.setAutoSkipAds(val);
        },

        /**
         * 兑换饵料配方设置变更
         */
        onExchangeBaitChange(e) {
            this.setData({
                exchangeBait: e.detail.value[0] ? true : false
            });
            // 可以在这里保存设置到本地存储或上传到服务器
        }
    }
})