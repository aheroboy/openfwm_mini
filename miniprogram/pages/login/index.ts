import { Apis } from "../../service/apiimpl";
const app = getApp();
app.BasePage({
  data: {
    loading: false,
    isLogining: false,
    isAgrAgreed: false,
    isPPAgreed: false,
    nickName: "未设置",
    avatarUrl: null,
    version: '1.0.0' // 添加版本信息
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({ avatarUrl });
  },

  handleAgrChange(e) {
    this.setData({ isAgrAgreed: !this.data.isAgrAgreed });
  },
  handlePPChange(e) {
    this.setData({ isPPAgreed: !this.data.isPPAgreed });
  },

  // 登录按钮处理
  async handleLogin() {
    if (!this.data.isAgrAgreed || !this.data.isPPAgreed) {
      return wx.showToast({ title: '请先同意用户协议与隐私协议', icon: 'none' });
    }

    this.setData({ loading: true });
    try {
      const { code } = await wx.login();
      await Apis.loginUser(code, {
        avatarUrl: this.data.avatarUrl,
        nickName: this.data.nickName,
        password: ''
      });
    } catch (error) {
      console.error('登录失败:', error);
      wx.showToast({ title: '登录失败', icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
})