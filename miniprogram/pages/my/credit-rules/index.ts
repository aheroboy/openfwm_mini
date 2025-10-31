import {Entities} from '../../../service/entities'
import {Apis} from '../../../service/apiimpl'
Page({
    /**
     * 页面数据
     */
    data: {
      rules: [] as Entities.RuleItem[],
      currentPage: 1,
      pageSize: 10,
      groupedRules: {} as Record<string, Entities.RuleItem[]> // 按等级范围分组的规则
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
      this.loadMore();
    },

    loadMore(){
        this.fetchRules().then(rules => {
            if(rules.length > 0) {
                this.setData({ rules:[...this.data.rules,...rules] }, () => {
                    this.processRules(); // 处理数据并分组
                  });
            }
          });
    },

    /**
     * 获取规则数据
     */
    async fetchRules(): Promise<Entities.RuleItem[]> {
        try {
            const data = await Apis.getCreditRules({pageNum: this.data.currentPage, pageSize: this.data.pageSize});
            if(data.records && data.records.length > 0) {
                this.setData({
                    currentPage: this.data.currentPage + 1
                })
                return data.records;
            }
        } catch (error) {
            console.error('获取积分规则失败:', error);
            // 如果接口调用失败，不影响页面显示，继续使用mock数据
        }
        return [];
    },

    /**
     * 处理规则数据：排序并按等级范围分组
     */
    processRules() {
      const { rules } = this.data;
      
      // 1. 按sortOrder升序排序
      const sortedRules = [...rules].sort((a, b) => a.sortOrder - b.sortOrder);
      
      // 2. 按等级范围（如"1-4"）分组
      const groupedRules: Record<string, Entities.RuleItem[]> = {};
      sortedRules.forEach(rule => {
        const rangeKey = `${rule.levelRangeStart}-${rule.levelRangeEnd}`;
        if (!groupedRules[rangeKey]) {
          groupedRules[rangeKey] = [];
        }
        groupedRules[rangeKey].push(rule);
      });
      
      // 3. 更新数据
      this.setData({ groupedRules });
    },

  });
