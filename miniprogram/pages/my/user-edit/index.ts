
const app = getApp()
import { Apis } from '../../../service/apiimpl'
import { Utils } from '../../../utils/util'

interface UserInfo {
    nickname: string
    gender: 'male' | 'female'
    phone: string
    email: string
    avatar: string
}

app.BasePage({
    data: {
        ios: app.globalData.ios,
        userInfo: {
            nickname: '',
            avatar: ''
        } as UserInfo
    },

    onLoad() {
        Utils.calculateMainHeight()
        this.loadUserData()
    },

    onShow() {
        this.loadUserData();
    },

    loadUserData() {
        Apis.getUserInfo().then(res => {
            this.setData({ userInfo: res })
            wx.setStorageSync("loginUser", res)
        }).catch(res => {
            console.error(res)
        })
    },


    // 编辑用户名
    editNickname() {
        wx.navigateTo({
            url: '/pages/my/nickname-edit/index?nickname=' + this.data.userInfo.nickname,
            success: () => console.log('跳转到昵称修改页成功'),
            fail: (err) => {
                console.error('跳转失败:', err)
                wx.showToast({
                    title: '无法打开修改页面',
                    icon: 'none'
                })
            }
        })
    },

    showAgrement() {
        wx.navigateTo({ url: '/pages/agrpp/agreement/index' })
    },
    // 隐私政策
    showPrivacy() {
        wx.navigateTo({ url: '/pages/agrpp/pp/index' })
    },
    cancelAccount() {
        wx.navigateTo({ url: '/pages/cancel-account/index' })
    },
    // 退出登录
    logout() {
        wx.showModal({
            title: '提示',
            content: '确定要退出登录吗？',
            success: (res) => {
                if (res.confirm) {
                    Apis.logout().then(res => {
                        wx.setStorageSync("loginUser", null)
                        wx.setStorageSync("access_token", null)
                        wx.reLaunch({
                            url: '/pages/login/index',
                            success: (res) => {
                                console.info(res)
                            },
                            fail: (err) => {
                                console.info(err)
                            },
                            complete: (info) => {
                                console.info(info)
                            }
                        })
                    })
                }
            }
        })
    }
})