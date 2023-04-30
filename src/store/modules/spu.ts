import { defineStore } from 'pinia'
import {
  reqSpuList,
  reqBrandList,
  reqBaseSaleAttrList,
  reqSaveSpuInfo,
  reqSpuById,
  reqBrandById,
} from '/@/api/sys/spu'

export default defineStore('app-spu', {
  state: (): any => {
    return {
      spuInfo: {},
      brandList: [],
      saleAttrList: [],
      // spuById: {},
    }
  },
  actions: {
    async getSpuList(params: any) {
      this.spuInfo = await reqSpuList(params)
    },

    async getBrandList() {
      this.brandList = await reqBrandList()
    },

    async getSaleAttrList() {
      this.saleAttrList = await reqBaseSaleAttrList()
    },

    async saveNewSpu(spu: any) {
      const spuSaleAttrList = spu.spuSaleAttrList.map((item: any) => {
        const { tempAttrValue, inputVisible, ...tt } = item
        return tt
      })
      await reqSaveSpuInfo(Object.assign(spu, { spuSaleAttrList }))
    },

    async getSpuById(spuId: any) {
      return await reqSpuById(spuId)
    },

    async getBrandById(tmId: any) {
      const tm = await reqBrandById(tmId)
      return tm.tmName
    },

    clearSpuStore() {
      this.spuInfo = {}
    },

    restSaleAttrs(val: any) {
      this.saleAttrList = this.saleAttrList.filter((item: any) => item.name !== val)
    },
  },
  getters: {
    spuList(state) {
      return state.spuInfo.records
    },
    tmList(state) {
      return state.brandList.map((item: any) => ({
        key: item.id,
        label: item.tmName,
        value: item.tmName,
      }))
    },
    saleAttrs(state) {
      return state.saleAttrList.map((item: any) => ({
        label: item.name,
        id: item.id,
        value: item.name,
      }))
    },
  },
})
