import { defineStore } from 'pinia'
import {
  reqBrandInfo,
  reqAddBrand,
  reqUploadLogo,
  reqRemoveBrand,
  reqUpdateBrand,
} from '/@/api/sys/brand'
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
    maxPageNum(): number | undefined {
      if (this.brandInfo) return this.brandInfo.pages
    },
  },
  actions: {
    // 由于对axios的request的封装，每次请求都会有响应值的判断，如code不等于200或20000 就有弹窗报错
    // 所以这里的请求结果如果不正确，就直接报错，下面的赋值操作就不会执行

    // 获取所有品牌信息
    async getBrandInfo(param: BasicPageParams) {
      const data = await reqBrandInfo(param)
      this.brandInfo = data
    },

    // 添加品牌
    async addBrand(params: BrandList) {
      await reqAddBrand(params)
    },

    // 上传logo
    async uploadLogo(formData: object): Promise<string> {
      return await reqUploadLogo(formData)
    },

    // 删除商品
    async removeBrand(params: { id: number }): Promise<void> {
      await reqRemoveBrand(params)
    },

    async updateBrand(params: BrandList) {
      await reqUpdateBrand(params)
    },
  },
})
