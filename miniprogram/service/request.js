/**
 * 封装wx.request，统一处理JWT Token
 */
class Request {
  constructor() {
    //DEV ENV
    // this.api = "http://192.168.101.110:80",
    // this.baseUrl = this.api + "/api",
    // this.imageUrl = this.api

    //Local ENV
     this.baseUrl = "http://192.168.101.92:8081",
     this.imageUrl = "http://192.168.101.110"

    //Prod ENV

    this.tokenKey = 'access_token'; // 存储Token的键名
  }

  // 获取本地存储的Token
  getToken() {
    try {
      return wx.getStorageSync(this.tokenKey);
    } catch (e) {
      console.error('获取Token失败:', e);
      return null;
    }
  }

  // 设置Token到本地存储
  setToken(token) {
    try {
      wx.setStorageSync(this.tokenKey, token);
      return true;
    } catch (e) {
      console.error('存储Token失败:', e);
      return false;
    }
  }

  // 移除Token
  removeToken() {
    try {
      wx.removeStorageSync(this.tokenKey);
      wx.removeStorageSync('loginUser')
      return true;
    } catch (e) {
      console.error('移除Token失败:', e);
      return false;
    }
  }

  // 发起请求
  request(options) {
    const {
      url,
      method = 'GET',
      data = {},
      header = {},
      needToken = true,
      ...otherOptions
    } = options;

    // 拼接完整URL
    const fullUrl = this.baseUrl + url;

    // 合并请求头，添加Token
    if (needToken) {
      const token = this.getToken();
      if (token) {
        header.Authorization = `Bearer ${token}`;
      } else {
        console.warn('请求需要Token，但未找到有效Token');
        wx.navigateTo({
          url: '/pages/login/index',
        })
        return;
      }
    }

    // 返回Promise对象
    return new Promise((resolve, reject) => {
      wx.request({
        url: fullUrl,
        method,
        enableCache:true,
        data,
        header,
        success: (res) => {
          // 统一处理状态码
          if (res.statusCode === 200) {
            resolve(res.data);
          } else if (res.statusCode === 401) {
            // Token过期或无效，清除本地Token并处理
            console.error(res)
            this.removeToken();
            wx.showToast({
              title: '登录状态已过期，请重新登录',
              icon: 'none'
            });
            // 可以跳转到登录页
            reject({ code: 401, message: '未授权' });
          } else {
            reject({ code: res.statusCode, message: res.data.message || '请求失败' });
          }
        },
        fail: (err) => {
          console.error('请求失败:', err);
          reject({ code: -1, message: '网络错误' });
        },
        complete: () => {
          // 请求完成后的操作
        },
        ...otherOptions
      });
    });
  }
  // 上传文件
  uploadFile(options) {
    const {
      url,
      filePath,
      name = 'file',
      formData = {},
      header = {},
      needToken = true,
      fileUrlField = 'fileUrl',
      processResponse = this._defaultProcessResponse, // 自定义响应处理函数
      successCallback = null, // 上传成功后的回调
      failCallback = null, // 上传失败后的回调
      showSuccessToast = true, // 是否显示成功提示
      showFailToast = true, // 是否显示失败提示
      ...otherOptions
    } = options;

    const fullUrl = this.baseUrl + url;

    if (needToken) {
      const token = this.getToken();
      if (token) {
        header.Authorization = `Bearer ${token}`;
      } else {
        console.warn('上传需要Token，但未找到有效Token');
      }
    }

    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: fullUrl,
        filePath,
        name,
        formData,
        header,
        success: (res) => {
          try {
            // 处理响应数据
            const processedData = processResponse(res, fileUrlField);
            
            if (processedData.success) {
              if (showSuccessToast) {
                wx.showToast({
                  title: processedData.message || '上传成功',
                  icon: 'success'
                });
              }
              
              // 执行成功回调
              if (typeof successCallback === 'function') {
                successCallback(processedData);
              }
              
              resolve(processedData);
            } else {
              if (showFailToast) {
                this._showErrorToast(processedData.message || '上传失败');
              }
              
              // 执行失败回调
              if (typeof failCallback === 'function') {
                failCallback(processedData);
              }
              
              reject(processedData);
            }
          } catch (e) {
            console.error('处理上传响应时出错:', e);
            this._showErrorToast('处理上传结果失败');
            reject({ code: -1, message: '处理上传结果失败', error: e });
          }
        },
        fail: (err) => {
          console.error('上传失败:', err);
          const errorMsg = err.errMsg || '网络连接错误';
          
          if (showFailToast) {
            this._showErrorToast(errorMsg);
          }
          
          // 执行失败回调
          if (typeof failCallback === 'function') {
            failCallback({ code: -1, message: errorMsg, error: err });
          }
          
          reject({ code: -1, message: errorMsg, error: err });
        },
        ...otherOptions
      });

      return uploadTask;
    });
  }

  // 默认的响应处理函数
  _defaultProcessResponse(res, fileUrlField) {
    let data = res.data;
    
    // 尝试解析JSON
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
    } catch (e) {
      console.warn('上传返回数据不是JSON格式', data);
      return {
        success: false,
        code: -1,
        message: '服务器响应格式错误',
        originalData: data,
        rawResponse: res
      };
    }
    
    // 检查状态码
    const isSuccess = res.statusCode === 200;
    
    // 提取文件URL
    const fileUrl = data[fileUrlField] || null;
    
    // 提取消息
    const message = data.message || (isSuccess ? '上传成功' : '上传失败');
    
    return {
      success: isSuccess,
      code: res.statusCode,
      message,
      fileUrl,
      data: data,
      rawResponse: res
    };
  }

  // 显示错误提示
  _showErrorToast(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  } 
  // 快捷方法: GET请求
  get(url, data = {}, options = {needToken:true}) {
    return this.request({
      url,
      method: 'GET',
      data,
      ...options
    });
  }

  // 快捷方法: POST请求
  post(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    });
  }

  // 快捷方法: PUT请求
  put(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    });
  }

  // 快捷方法: DELETE请求
  delete(url, data = {}, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    });
  }
}

// 导出单例实例
export default new Request();