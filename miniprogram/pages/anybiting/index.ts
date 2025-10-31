import { Entities } from "../../service/entities";
import { Apis } from '../../service/apiimpl';

const app = getApp();
app.BasePage({
    data: {
        ios: app.globalData.ios,
        circleMessages: [] as Entities.CircleMessage[],
        centerPostion: { longitude: 0, latitude: 0 } as Entities.Position,
        showInput: false,
        userId: '',
        city: null,
        isRefreshing: false,
        // 城市选择相关状态
        showCitySelector: false,
        cityList: [] as Array<{ cityCode: string, city: string }>,
        searchKeyword: '',
        searchResult: [] as Array<{ cityCode: string, city: string }>,
        popularCities: [
            { cityCode: '110000', city: '北京' },
            { cityCode: '310000', city: '上海' },
            { cityCode: '440100', city: '广州' },
            { cityCode: '440300', city: '深圳' },
            { cityCode: '330100', city: '杭州' },
            { cityCode: '320100', city: '南京' }
        ]
    },
    onPullDownRefresh: function () {
        console.info("calling...")
        if (this.data.city) {
            try {
                this.setData({ isRefreshing: true })
                this.loadForwardMessageByScore();
                console.info("calling2")
                this.setData({ isRefreshing: false })
                console.info("calling3")
            } catch (e) {
                console.info("calling4")
                this.setData({ isRefreshing: false })
                console.info("calling5")
            }
        } else {
            this.setData({ isRefreshing: false })
        }
    },
    onShow: function () {
        const user = wx.getStorageSync("loginUser")
        if (user) {
            this.setData({ userId: user.id })
        }
        if (this.data.city) {
            this.loadCircleMessagesByCity(this.data.city.cityCode);
        }
    },
    onLoad() {
        this.init();
    },
    onSwitchCityClicked() {
        this.setData({ showCitySelector: true });
        this.searchCities("");
       
    },

    // 关闭城市选择器
    onCloseCitySelector() {
        this.setData({ showCitySelector: false, searchKeyword: '', searchResult: [] });
    },

    // 搜索关键词输入
    onSearchKeywordInput(e) {
        const keyword = e.detail.value;
        this.setData({ searchKeyword: keyword });
        this.searchCities(keyword);
    },

    // 搜索城市
    async searchCities(keyword: string) {
        try {
            const result = await Apis.searchCities(keyword);
            if (result && result.data) {
               this.setData({ searchResult: result.data });
            }
        } catch (error) {
            console.error('搜索城市失败', error);
        }
    },

    // 选择城市
    async onSelectCity(e) {
        const city = e.currentTarget.dataset.city;
        const cityCode = e.currentTarget.dataset.code;

        // 存储城市信息
        this.setData({
            city: { city, cityCode },
            showCitySelector: false,
            searchKeyword: '',
            searchResult: []
        });
        wx.setStorageSync("city", { city, cityCode })

        // 刷新消息列表
        await this.loadCircleMessagesByCity(cityCode);
    },
    async init() {
        let center = wx.getStorageSync("center");
        let city = wx.getStorageSync("city")
        if (!city) {
            if (center) {
                const serverCity = await Apis.getCityByPosition(center);
                if (serverCity?.code == 200) {
                    city = serverCity.data
                    this.setData({ city: city })
                    wx.setStorageSync("city", city)
                    
                } else {
                    city = Entities.CITY
                    this.setData({
                        city: city
                    })
                    wx.setStorageSync("city", city)
                }
            } else {
                try {
                    const res = await Apis.getCurrentPosition()
                    if (!res.latitude || !res.longitude) {
                        city = Entities.CITY
                        this.setData({
                            city: city
                        })
                        wx.setStorageSync("city", city)
                    } else {
                        const location: Entities.Position = { latitude: res.latitude, longitude: res.longitude }
                        this.setData({ centerPostion: location })
                        wx.setStorageSync("center", location)
                        const serverCity = await Apis.getCityByPosition(location);
                        if (serverCity?.code == 200) {
                            city = serverCity.data 
                            this.setData({ city: city })
                            wx.setStorageSync("city", city)
                        } else {
                            city = Entities.CITY
                            this.setData({
                                city: city
                            })
                            wx.setStorageSync("city", city)
                        }
                    }

                } catch (e) {
                    city = Entities.CITY
                    this.setData({
                        city:city
                    })
                    wx.setStorageSync("city", city)
                }
            }

        }

        this.loadCircleMessagesByCity(city.cityCode);
    },


    loadCircleMessagesByCity: async function (cityCode) {
        const messages: Entities.CircleMessage[] = await Apis.loadCircleMessages(cityCode)
        this.setData({ circleMessages: [...messages] })
    },

    async loadBackwardMessagesByScore() {
        const { circleMessages, city } = this.data;
        if (circleMessages && circleMessages.length > 0) {
            const cursor = circleMessages[circleMessages.length - 1].cursor;
            const messages: Entities.CircleMessage[] = await Apis.loadBackwardMessages(city.cityCode, cursor)
            this.setData({ circleMessages: [...circleMessages, ...messages] })
        }
    },
    async loadForwardMessageByScore() {
        const { circleMessages, city } = this.data;
        if (circleMessages && circleMessages.length > 0) {
            const cursor = circleMessages[0].cursor;
            const messages: Entities.CircleMessage[] = await Apis.loadForwardMessages(city.cityCode, cursor)
            this.setData({ circleMessages: [...messages.reverse(), ...circleMessages] })
        }
    }
})