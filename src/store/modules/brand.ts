import { defineStore } from 'pinia'
import { reqBrandInfo } from '/@/api/sys/brand'
import { BasicPageParams } from '/@/api/model/baseModel'
import { BrandInfo, BrandList } from '/#/store'

interface BrandState {
  brandInfo: Nullable<BrandInfo>
}

export const useBrandStore = defineStore({
  id: 'app-brand',
  state: (): BrandState => ({
    brandInfo: null,
  }),
  getters: {
    brandList(): BrandList[] | undefined {
      if (this.brandInfo) return this.brandInfo.records
    },
    brandTotal(): number | undefined {
      if (this.brandInfo) return this.brandInfo.total
    },
  },
  actions: {
    async getBrandInfo(param: BasicPageParams) {
      // 由于对axios的request的封装，每次请求都会有响应值的判断，如code不等于200或20000 就有弹窗报错
      // 所以这里的请求结果如果不正确，就直接报错，下面的赋值操作就不会执行
      const data = await reqBrandInfo(param)
      this.brandInfo = data
    },
  },
})
