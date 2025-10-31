import { Apis } from "../../../service/apiimpl";

const app = getApp();
app.BasePage({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        currentLevel: 4, // 当前选中的等级，默认第4级
        currentPoints: 850, // 当前积分
        nextLevelPoints: 1000, // 下一等级所需积分
        progressPercentage: 85, // 升级进度百分比
        currentCategory: 'all', // 当前选中的分类，默认全部
        ios: app.globalData.ios,
        lvls: []
    },

    onLoad(options){
        this.setData({currentLevel: options.lvl})
        Apis.getCreditLvls().then(res => {
            this.setData({
                lvls: res.data
            });
            this.calculateProgress();
        }).catch(error => {
            console.error('获取等级数据失败:', error);
            // 提供mock数据，确保页面能正常显示
            this.setMockData();
        });
    },

    /**
     * 计算升级进度
     */
    calculateProgress() {
        const { lvls, currentLevel, currentPoints } = this.data;
        
        // 找到当前等级和下一等级
        const currentLevelData = lvls.find(lvl => lvl.levelId === currentLevel);
        const nextLevelData = lvls.find(lvl => lvl.levelId === currentLevel + 1);
        
        if (currentLevelData && nextLevelData) {
            // 计算进度百分比
            const progressPercentage = ((currentPoints - currentLevelData.minPoints) / (nextLevelData.minPoints - currentLevelData.minPoints)) * 100;
            
            this.setData({
                progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
                nextLevelPoints: nextLevelData.minPoints
            });
        }
    },

    /**
     * 选择等级
     */
    onLevelSelect(e) {
        const level = e.currentTarget.dataset.level;
        this.setData({
            currentLevel: level
        });
        
        // 如果有需要，可以跳转到等级详情页
        // wx.navigateTo({
        //   url: `/pages/my/credit-detail/index?level=${level}`
        // });
    },
});
