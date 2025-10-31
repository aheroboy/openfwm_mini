export module Utils {
  export const randomNumer = ():number => 
   Math.floor(Math.random() * 1000000)

  export const formatTime = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return (
      [year, month, day].map(formatNumber).join('/') +
      ' ' +
      [hour, minute, second].map(formatNumber).join(':')
    )
  }
  export const isNumberStr = (str:string)=> {
    // 先排除非字符串类型
    if (typeof str !== 'string') return false;
    // 转换为数字后检查是否为有限数（排除NaN、Infinity等）
    return !isNaN(str) && Number.isFinite(Number(str));
  }
  
  export const compressImage = (canvasContext, originalPath, scale = 0.8, quality = 0.5) => {
    return new Promise((resolve, reject) => {
      // 参数校验
      if (!canvasContext || !originalPath) {
        reject(new Error('canvasContext 和 originalPath 是必需参数'));
        return;
      }

      // 限制参数范围
      scale = Math.max(0.1, Math.min(1, scale));
      quality = Math.max(0.1, Math.min(1, quality));

      // 获取图片信息
      wx.getImageInfo({
        src: originalPath,
        success: (info) => {
          const { width, height } = info;
          const canvasWidth = width * scale;
          const canvasHeight = height * scale;

          // 绘制图片到 Canvas
          canvasContext.drawImage(originalPath, 0, 0, canvasWidth, canvasHeight);

          // 将 Canvas 内容保存为临时文件
          canvasContext.draw(false, () => {
            wx.canvasToTempFilePath({
              canvasId: canvasContext.canvasId,
              x: 0,
              y: 0,
              width: canvasWidth,
              height: canvasHeight,
              destWidth: canvasWidth,
              destHeight: canvasHeight,
              quality,
              fileType: 'jpg',
              success: (res) => resolve(res.tempFilePath),
              fail: (err) => reject(new Error(`Canvas 转临时文件失败: ${err.errMsg}`))
            });
          });
        },
        fail: (err) => reject(new Error(`获取图片信息失败: ${err.errMsg}`))
      });
    });
  }
  // export const smartCompressImage = (canvasContext, originalPath, callback,errcall,maxSize = 1000, quality = 0.7) => {
  //     wx.getImageInfo({
  //       src: originalPath,
  //       success: (info) => {
  //         const { width, height } = info;
  //         const scale = Math.min(1, maxSize / Math.max(width, height));
  //         compressImage(canvasContext, originalPath, scale, quality)
  //           .then((res) => {
  //             console.info(res)
  //             callback（res)
  //           }).catch((err) => {
  //             console.error(err)
  //             errcall(err);
  //           });
  //       },
  //       fail: (error) => {
  //         console.error(error)
  //       }
  //     });
  // }

  export const calculateMainHeight = () => {
    const NAV_CLASS = "nav";
    wx.createSelectorQuery()
      .select(`.${NAV_CLASS}`)
      .boundingClientRect()
      .exec((res) => {
        const windowHeight = wx.getStorageSync('wh') || wx.getSystemInfoSync().windowHeight;
        if (!res?.[0]) {
          return windowHeight;
        }

        return windowHeight - res[0].height
      })
  }
  const formatNumber = (n: number) => {
    const s = n.toString()
    return s[1] ? s : '0' + s
  }
}
