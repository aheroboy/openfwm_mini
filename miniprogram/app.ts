// app.ts
let origin = Page;
const basePage = (targetObj: WechatMiniprogram.Page.Constructor) => {
    const showAuthModal = () => {
        wx.showModal({
            title: '需要授权',
            content: '此功能需要获取您的地理位置，请在设置中授权',
            confirmText: '去设置',
            success(res) {
                if (res.confirm) {
                    wx.openSetting();
                }
            }
        });
    }
    const openLocationAccess = function () {
        try {
            wx.getSetting({
                success: (res) => {
                    if (res.authSetting['scope.userLocation']) {
                        wx.setStorageSync("hasLocation", true);
                        console.info("地理位置授权成功.");
                        return;
                    }
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success() {
                            console.info("地理位置授权成功.");
                            wx.setStorageSync("hasLocation", true);
                        },
                        fail(err) {
                            console.error(err);
                            wx.setStorageSync("hasLocation", false);
                            // 引导用户手动授权
                            showAuthModal();
                        }
                    });
                }
            })
        } catch (err) {
            wx.setStorageSync("hasLocation", false);
            console.error("获取位置失败:", err);
        }
    }
    const originOnReady = targetObj.onReady;
    targetObj.onReady = function (options: WechatMiniprogram.Page.ILifetime) {
        originOnReady?.call(this, options);
    }
    targetObj.openLocationAccess = openLocationAccess;
    targetObj.showAuthModal = showAuthModal;
    const originOnLoad = targetObj.onLoad;
    targetObj.onLoad = async function (options: WechatMiniprogram.Page.ILifetime) {
        originOnLoad?.call(this, options);
    };
    origin(targetObj);
};

const beforeRoute = async (res) => {
    if (res.path != "pages/login/index" 
    && res.path != "pages/anybiting/index"
     && res.path != "pages/agrpp/agreement/index"
      &&  res.path != "pages/agrpp/pp/index"
      &&  res.path != "pages/home/index"
      &&  res.path != "pages/spots/index"
      &&  res.path != "pages/show/index"
      ) {
        console.info("ROUTING PATH IS:",res.path)
        const user = await wx.getStorageSync("loginUser");
        if (!user && res.path != "pages/login/index") {
            wx.redirectTo({
                url: "/pages/login/index",
            }).catch(err => {
                console.info(err)
            }).finally(() => {
                console.info("done...")
            })
            return false;
        }
    }
}
const checkAndCreateFiles = (fs, logDirPath, logFiles) => {
    logFiles.forEach(logFile => {
        const logFilePath = `${logDirPath}/${logFile}`;
        fs.access({
            path: logFilePath,
            success: () => {
                console.log(`${logFile} exists`);
            },
            fail: () => {
                fs.writeFile({
                    filePath: logFilePath,
                    data: '',
                    success: res => {
                        console.log(`${logFile} created successfully`);
                    },
                    fail: err => {
                        console.error(`Failed to create ${logFile}`, err);
                    }
                });
            }
        });
    });
}


App({
    globalData: {
        ios:false
    },
    BasePage: basePage,
    onLaunch() {
        
        const deviceInfo = wx.getDeviceInfo()
        this.globalData.ios = new RegExp("ios",'i').test(deviceInfo.system);
        const { windowHeight, windowWidth } = wx.getSystemSetting();
        wx.setStorageSync("wh", windowHeight);
        wx.setStorageSync("ww", windowWidth);
        wx.onBeforeAppRoute(beforeRoute)
        
    },
});