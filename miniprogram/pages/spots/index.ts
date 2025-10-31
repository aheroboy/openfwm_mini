import * as api from "../../service/apiimpl";
import { Entities } from "../../service/entities"
import { Utils } from "../../utils/util";
const OPEN_SPOT = "../../images/go-fishing.png";
const app = getApp();
app.BasePage({
    data: {
        ios: app.globalData.ios,
        requireLocationAccess: true,
        latitude: 39.907953,
        longitude: 116.334536,
        cnt: 100000,
        markers: [],
        originMarkers: [],
        satellite: false,
        editMark: {},
        covers: [],
        markerMap: {},
        navLine: {},
        addFormVisible: 'hidden',
        markPosition: {
            longitude: 0,
            latitude: 0
        },
        points: [],
        posFinish: false,
        lineFinish: false,
        showMySpots: false,
        roles: [] as string[],
        curPos: { longitude: 0.0, latitude: 0.0 }
    },
    onLoad() {
        this.mapCtx = wx.createMapContext('spotMap')
    },
    onRegionChange(e: { type: string, detail?: { centerLocation?: { latitude: number, longitude: number } } }) {
        if (e.type === 'end' && e.detail?.centerLocation) {
            const { latitude, longitude } = e.detail.centerLocation;
            this.setData({ curPos: { latitude, longitude } })
            this._loadSpots(latitude, longitude);
        }
    },
    onShow() {
        const user = wx.getStorageSync("loginUser");
        if (user) {
            this.setData({ roles: user.roles })
        }
    },
    onReady: function () {
        let center = this.data.centerPostion
        if(!center) {
            center = wx.getStorageSync("center")
        }
        
        if (center) {
            this.setData({
                latitude: center.latitude,
                longitude: center.longitude
            })
            this.moveToLocation();
            this._loadSpots(center.latitude, center.longitude);
        } else {
            this._getCurrentPos(() => {
                this.moveToLocation();
                this._loadSpots(this.data.latitude, this.data.longitude);
            });
        }
       
    },
    async _getCurrentPos(callback?: () => void) {
        try {
            const center = wx.getStorageSync("center")
            if(!center) {
                const result = await api.Apis.getCurrentPosition()
                this.setData({ latitude: result.latitude, longitude: result.longitude })
            } else {
                this.setData({ latitude: center.latitude, longitude: center.longitude })
            }
            callback?.()
        } catch (e) {
            console.info("获取位置失败.",e)
        }
    },

    _displaySpots(res: Entities.Spot[]) {
        const that = this;
        const markers: Entities.Marker[] = [];
        const markerMap = new Map<number, Entities.Marker>();
        if (res?.length) {
            res.forEach(spot => {
                const marker = that._toMakers(spot);
                markerMap.set(marker.id, marker);
                markers.push(marker);
            });
        }
        that.setData({
            markers: markers,
            originMarkers: markers,
            markerMap: markerMap
        });
    },
    _loadSpots(latitude: number, longitude: number) {

        if (this.data.showMySpots && this.data.roles && this.data.roles.length > 0) {
            this._loadMySpots(latitude, longitude)
        } else if (this.data.showSecretSpots && this.data.roles && this.data.roles.length > 0) {
            this._loadSecretSpots(latitude, longitude)
        } else {
            this._loadAllSpots(latitude, longitude)
        }
    },

    _loadSecretSpots(lagitude: number, longitude: number) {
        api.Apis.loadSecretSpots(lagitude, longitude)
            .then(res => this._displaySpots(res))
            .catch(err => console.error('加载用户点位失败:', err));
    },

    _loadMySpots(lagitude: number, longitude: number) {
        api.Apis.loadUserSpots(lagitude, longitude)
            .then(res => this._displaySpots(res))
            .catch(err => console.error('加载用户点位失败:', err));
    },

    _loadAllSpots(latitude, longitude) {
        api.Apis.loadSpots(latitude, longitude)
            .then((res) => {
                this._displaySpots(res);
            })
            .catch((error) => {
                console.error('加载spots失败:', error);
            });
    },


    _toMakers(spot: Entities.Spot): Entities.Marker {
        const markerId = Utils.randomNumer();
        return {
            latitude: spot.latitude,
            longitude: spot.longitude,
            width: 60,
            height: 60,
            id: markerId,
            cityCode: spot.cityCode,
            spotId: spot.id,
            isFree: spot.isFree,
            isPrivate: spot.isPrivate,
            iconPath: OPEN_SPOT,
            label: {
                content: spot.name,
                bgColor: '#FFFFFF',
                borderRadius: 3,
                borderWidth: 1,
                padding: 2,
                textAlign: 'center'
            }
        };
    },

    onMineSpotsClicked: function () {
        this.setData({
            showMySpots: !this.data.showMySpots,
            showSecretSpots: false
        })
        this._loadSpots(this.data.latitude, this.data.longitude);
    },

    onSecretClicked: function () {
        this.setData({
            showSecretSpots: !this.data.showSecretSpots,
            showMySpots: false
        })
        this._loadSpots(this.data.latitude, this.data.longitude);
    },

    onCPSpotClicked() {
        const hasLocation = wx.getStorageSync("hasLocation");
        if (!hasLocation) {
            this.openLocationAccess();
        }
        this._getCurrentPos(() => {

            this.moveToLocation();
        });
    },
    toggleSatelliteMode(): void {
        const { satellite } = this.data
        this.setData({ satellite: !satellite })
    },
    onCircleClick() {
        wx.navigateTo({
            "url": "/pages/circle/index"
        })
    },
    onAddSpotClick: function () {
        try {
            const url = '/pages/spots/addspot/index?latitude=' + this.data.curPos.latitude + "&longitude=" + this.data.curPos.longitude;
            wx.navigateTo({
                url,
                fail: (err) => {
                    console.error('导航失败:', err);
                    wx.showToast({
                        title: '页面跳转失败',
                        icon: 'none'
                    });
                }
            });
        } catch (error) {
            console.error('发生异常:', error);
        }
    },
  
    onSpotClicked: function (e: { markerId: number }) {
        try {
            const marker = this.data.markerMap.get(e.markerId);
            if (!marker?.spotId) throw new Error('Invalid marker data');

            wx.navigateTo({
                url: `/pages/home/index?spotId=${encodeURIComponent(marker.spotId)}`
            });
        } catch (error) {
            console.error('Navigation failed:', error);
            wx.showToast({ title: '跳转失败', icon: 'none' });
        }
    },
    moveToLocation: function () {
        this.mapCtx?.moveToLocation()
    },
})
