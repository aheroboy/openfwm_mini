import { Apis } from "../../service/apiimpl";
import {Utils} from '../../utils/util'
Component({
    properties: {
        favorite:{
          type: Boolean,
          value:false
        }
      },
    data: {
        spotData: [],
        spotPageNum: 1,
        spotPageSize: 10,
        isSpotLoading: false,
    },
    lifetimes: {
        attached() {
            this.setData({
                spotData: [],
                spotPageNum: 1,
                spotPageSize: 10
            })
            this.onSpotScrollToLower();
        }
    },

    methods: {
        onSpotScrollToLower() {
            const { spotPageNum, spotPageSize, spotData, isSpotLoading } = this.data;
            if (isSpotLoading) {
                return;
            }
            this.setData({ isSpotLoading: true });
            Apis.getSpotPage(spotPageNum, spotPageSize, this.data.favorite ? 1: 0)?.then(res => {
                let newPageNum = spotPageNum;
                if (spotPageNum < res.pages) {
                    newPageNum = spotPageNum + 1;
                }

                //永远获取到最后一页为止的数据（不包含最后一页）
                const preData = spotData.slice(0, spotPageSize * (spotPageNum - 1));
                this.setData({
                    spotPageNum: newPageNum,
                    spotData: [...preData, ...res.records]
                });
            }).catch(err => {
                console.info(err)
            }).finally(() => {
                this.setData({ isSpotLoading: false })
            })
        },

        onSetCredit(e){
           const credit = e.currentTarget.dataset.credit;
           wx.showModal({
            editable: true,
            placeholderText: `${credit?credit:'查看秘密钓点所需积分'}`,
            success: res => {
                if (res.confirm) {
                    if(!Utils.isNumberStr(res.content.trim())) {
                        wx.showToast({
                            title:'请输入数字.',
                            icon:'error'
                        })
                        return;
                    }
                    const v: number = res.content.trim();
                    Apis.setSpotCredit( e.currentTarget.dataset.id,v).then(res => {
                        if(res.status) {
                            wx.showToast({
                                title:'积分设置成功.',
                                icon:'success'
                            })
                        }
                    })
                } else {
                    console.log('用户点击了取消');
                }
            }
           })
        },


        goViewSpot(e) {
            wx.navigateTo({
                url: "/pages/home/index?spotId=" + e.currentTarget.dataset.id
            })
        }
    }
})