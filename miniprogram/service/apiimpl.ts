import { Entities, COMMONENT_TARGET } from "./entities";
import request from './request';
module Apis {
    export async function getCityByPosition(location: Entities.Position) {
        return await request.get('/circle/getCity', location, { needToken: false })
    }
    export async function setSpotCredit(spotId: string, credit: number) {
        return await request.get('/credit/setCredit', { spotId, credit })
    }
    export async function checkCreditAvailable(spotId: string) {
        return await request.get('/credit/isCreditAvailable', { spotId })
    }
    export async function harvestLike(harvestId: string, isLiked: boolean) {
        return await request.get(isLiked ? '/spot/harvest/likes' : '/spot/harvest/dislike', { harvestId });
    }
    export async function loadHarvestComments(id: string, pageNum: number = 1, pageSize: number = 10) {
        return await request.get('/comments/list', { targetId: id, targetType: COMMONENT_TARGET, pageNum, pageSize })
    }
    export async function loadHarvest(id: string) {
        return await request.get('/spot/v2/getHarvest', { id },{needToken:false});
    }
    export async function getCreditRules(data: {}) {
        return await request.get('/credit/getCreditRules', data)
    }
    export async function getCreditRecords(data: {}) {
        return await request.get('/credit/records/list', data)
    }
    export async function getCreditLvls() {
        return await request.get('/credit/getCreditLvls');
    }
    export async function setAutoSkipAds(autoSkip: Boolean) {
        return await request.get('/credit/skipAds', { skipAds: autoSkip })
    }
    export async function getUserCredit() {
        return await request.get('/credit/get');
    }
    export async function sendCircleMessage(circleId, message) {
        return await request.post('/circle/message', { circleId, message })
    }
    export async function queryCircleSpots(url, data) {
        return await request.get(url, data)
    }
    export async function getCircleLocations(location: Entities.Position) {
        return await request.get("/circle/getCircleLocations", location)
    }
    export async function loadBackwardMessages(cityCode: string, cursor: string) {
        return await request.get("/circle-messages/non-realtime", { cityCode, cursor, isForward: false }, { needToken: false })
    }
    export async function loadForwardMessages(cityCode: string, cursor: string) {
        return await request.get("/circle-messages/non-realtime", { cityCode, cursor, isForward: true }, { needToken: false })
    }
    export async function loadCircleMessages(cityCode: string) {
        return await request.get("/circle-messages/quasi-realtime", { cityCode }, { needToken: false })
    }

    export async function checkEixts(location) {
        return await request.post("/spot/checkSpotExists", location)
    }
    export async function cancelUser() {
        return await request.post('/user/cancel', {})
    }
    export async function getAgrPp(type) {
        return await request.get("/common/agr", { type: type }, { needToken: false })
    }

    export function getSpotCommentPage(pageNum: number, pageSize: number, spotId: string) {
        return request.get('/spot/getComments', { pageNum, pageSize, spotId });
    }
    export function getSpotPage(pageNum: number, pageSize: number, isCollected) {
        return request.get("/spot/collected", { isCollected, pageNum, pageSize }, { needToken: true })
    }
    export function saveUserGender(gender) {
        return request.post("/user/saveUserGender", { gender: gender }, { needToken: true })
    }

    export function saveUserEmail(email, code) {
        return request.post("/user/saveUserEmail", { email: email, code }, { needToken: true })
    }

    export function saveUserAvatar(avatar) {
        return request.post("/user/saveUserAvatar", { avatarUrl: avatar }, { needToken: true })
    }

    export function saveUserNickName(nickName) {
        return request.post("/user/saveUserNickName", { nickname: nickName }, { needToken: true })
    }
    export async function loadUserMgrSpots(pageNum, pageSize) {
        return await request.get("/spot/getUserMgrSpots", { pageNum, pageSize }, { needToken: true })
    }

    export async function loadUserSpot(id) {
        return await Promise.resolve(request.get("/spot/v2/getUserSpot", { spotId: id }, { needToken: false }));
    }
    export async function uploadFile(filePath) {
        return new Promise((resolve, reject) => {
            request.uploadFile({
                filePath: filePath,
                url: "/file/upload"
            }).then((res) => {
                res.data.data.url = request.imageUrl + "/" + res.data.data.url
                console.info(res.data)
                resolve(res.data)
            }).catch((err) => {
                reject(err);
            })
        })
    }
    export async function loadAddSpotProperties() {
        return await request.get('/spot/getProps', {}, { needToken: true });
    }
    export async function queryUserSpots(queryStr: string) {
        return request.post("/spot/querySpots", { query: queryStr }, { needToken: true })
    }

    export async function collectSpot(id: string) {
        return request.get("/spot/collect", { spotId: id })
    }
    export async function loadDiscoverSpot(spotId: string) {
        return request.get('/spot/getSpot', { spotId: spotId }, { needToken: true })
    }
    export async function loadSecretSpots(latitude: number, longitude: number) {
        return request.get("/spot/getSecretSpots", { latitude: latitude, longitude: longitude });
    }
    export async function loadUserSpots(latitude: number, longitude: number) {
        return request.get("/spot/getUserSpots", { latitude: latitude, longitude: longitude });
    }
    export async function loadSpots(latitude: number, longitude: number) {
        return request.get("/spot/v2/getSpotsByLocation", { latitude: latitude, longitude: longitude },{needToken:false});
    }
    export async function loadSpotNavigationInfo(spotId: string) {
        return await request.get("/spot/getSpotNavLine", { spotId: spotId })
    }

    export async function loadSpotVisiters(pageNum: number, pageSize: number, spotId: string) {
        return await request.get("/spot/getSpotHarvests", { pageNum, pageSize, spotId }, { needToken: true });
    }

    export function getCurrentPosition() {
        return new Promise<Entities.Position>((resolve, reject) => {
            wx.getFuzzyLocation({
                type: 'wgs84',
                success: (res) => {
                    resolve(res);
                },
                fail: (err) => {
                    console.error('定位失败', err);
                    reject(err)
                }
            })
        });
    }
    export async function hasUserLogin() {
        const user = wx.getStorageSync("loginUser");
        const token = wx.getStorageSync("access_token");
        const hasToken = token !== undefined && token != null && token != "";
        const hasLogin = user?.hasLogin;
        const isLogining = user?.isLogining;
        return {
            hasToken: hasToken,
            hasLogin: hasLogin,
            isLogining: isLogining,
            hasUserLogin: () => hasToken && hasLogin
        }
    }
    export async function getUserInfo() {
        console.info("calling.....")
        return await request.get("/user/getUserInfo", {}, { needToken: true });
    }

    export function logout() {
        return request.get('/user/logout', {}, { needToken: true })
    }
    export function loginUser(code, user: Entities.UserInfo) {
        console.info(user)
        return wx.request({
            url: request.baseUrl + '/user/loginwx',
            data: {
                wxCode: code,
                nickName: user.nickName,
                avatarUrl: user.avatarUrl,
            },
            method: 'POST',
            header: {
                'content-type': 'application/json',
            },
            success(res: {
                data: {
                    data: {
                        avatarUrl: string,
                        nickname: string,
                        id: string,
                        roles: [],
                        token: string
                    }
                }
            }) {
                console.info(res)
                const { avatarUrl, nickname, id, roles, token } = res.data.data;
                request.setToken(token);
                wx.setStorageSync("loginUser", {
                    hasLogin: true,
                    avatarUrl: avatarUrl,
                    nickname: nickname,
                    id: id,
                    roles: roles
                })
                wx.showToast({
                    title: "登陆成功",
                    duration: 2000
                })
                wx.navigateBack().catch(res => {
                    wx.switchTab({ url: "/pages/anybiting/index" });
                })
            },
            fail(error) {
                console.error(error);
                wx.setStorageSync('loginUser', {})
                wx.showToast({
                    title: "登陆失败",
                    duration: 2000
                })
            }
        })
    }

    export async function searchCities(keyword: string) {
        return await request.get('/circle/searchCities', { keyword }, { needToken: false })
    }
}

export { Apis }