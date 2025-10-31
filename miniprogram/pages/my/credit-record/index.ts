import {Entities} from '../../../service/entities'
import { Apis } from '../../../service/apiimpl'

const app = getApp()
app.BasePage({

    /**
     * 组件的初始数据
     */
    data: {
        ios: app.globalData.ios,
        records: []  as Entities.PointsRecord[],
        groupedRecords: [] as Array<{month: string, totalPoints: number, records: Entities.PointsRecord[]}>,
        currentPage: 1,
        pageSize: 20,
        isLoading: false
    },
  
    onShow(){
        this.setData({
            records: [],
            groupedRecords: [],
            currentPage: 1
        })
        this._loadMore(this.data.currentPage)
    },

    // 加载数据
    _loadMore(page: number) {
        this.setData({ isLoading: true })
        
        // 尝试从接口获取数据
        Apis.getCreditRecords({pageNum: page, pageSize: this.data.pageSize}).then(res => {
            this.setData({
                isLoading: false,
                currentPage: res.records.length > 0 ? page + 1 : page,
                records: [...this.data.records, ...res.records]
            })
            this.processRecords()
        }).catch(() => {
            // 如果接口调用失败，使用mock数据
            this.setData({ isLoading: false })
        })
    },
   
    
    // 处理记录数据，按月份分组
    processRecords() {
        const records = this.data.records
        if (!records || records.length === 0) return
        
        // 按月份分组
        const groups: {[key: string]: Entities.PointsRecord[]} = {}
        
        records.forEach(record => {
            // 提取月份（假设createdDate格式为'YYYY-MM-DD HH:mm:ss'）
            const month = record.createdDate.substring(0, 7)
            if (!groups[month]) {
                groups[month] = []
            }
            groups[month].push(record)
        })
        
        // 转换为数组并计算每月总积分
        const groupedArray: Array<{month: string, totalPoints: number, records: Entities.PointsRecord[]}> = []
        Object.keys(groups).sort((a, b) => b.localeCompare(a)).forEach(month => {
            const monthRecords = groups[month]
            const totalPoints = monthRecords.reduce((sum, record) => sum + record.point, 0)
            
            // 格式化月份显示（例如：2024-03 -> 2024年3月）
            const [year, monthNum] = month.split('-')
            const formattedMonth = `${year}年${parseInt(monthNum)}月`
            
            groupedArray.push({
                month: formattedMonth,
                totalPoints: totalPoints,
                records: monthRecords
            })
        })
        
        this.setData({
            groupedRecords: groupedArray
        })
    },
    
    // 加载更多数据
    loadMore() {
        if (this.data.isLoading) return
        this._loadMore(this.data.currentPage)
    },
    
    /**
     * 组件的方法列表
     */
    methods: {
     
    }
  });
  

      