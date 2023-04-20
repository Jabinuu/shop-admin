import { defineStore } from 'pinia'
import { reqBrandList } from '/@/api/sys/brand'
import { BasicPageParams } from '/@/api/model/baseModel'

export const useBrandStore = defineStore({
  id: 'app-brand',
  state: () => ({
    brandList: [],
  }),
  getters: {},
  actions: {
    async getBrandList(param: BasicPageParams) {
      // 由于对axios的request的封装，每次请求都会有响应值的判断，如code不等于200或20000 就有弹窗报错
      // 所以这里的请求结果如果不正确，就直接报错，下面的赋值操作就不会执行
      const data = await reqBrandList(param)
      this.brandList = data.records
    },
  },
})
