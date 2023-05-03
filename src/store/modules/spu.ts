import { defineStore } from 'pinia'
import {
  reqSpuList,
  reqBrandList,
  reqBaseSaleAttrList,
  reqSaveSpuInfo,
  reqSpuById,
  reqBrandById,
  reqRemoveSpu,
  reqSpuImageList,
  reqSaveSku,
} from '/@/api/sys/spu'

import { message } from 'ant-design-vue'

export default defineStore('app-spu', {
  state: (): any => {
    return {
      spuInfo: {},
      brandList: [],
      saleAttrList: [],
      spuImageList: [],
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

    async getSpuImageList(spuId: number) {
      this.spuImageList = await reqSpuImageList(spuId)
    },

    async getSpuById(spuId: any) {
      return await reqSpuById(spuId)
    },

    async getBrandById(tmId: any) {
      // 这里的接口是由bug的，当品牌被删除后，这个品牌下的spu却仍然存在，这会导致tm=null
      const tm = await reqBrandById(tmId)
      if (Object.prototype.toString.call(tm) === '[object Null]') {
        message.warning('这个Spu的品牌已经不存在了，请重新选定品牌')
      } else {
        return tm.tmName
      }
    },

    async removeSpu(spuId: number) {
      await reqRemoveSpu(spuId)
    },

    async saveSku(params: any) {
      await reqSaveSku(params)
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
