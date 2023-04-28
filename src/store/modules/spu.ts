import { defineStore } from 'pinia'
import { reqSpuList } from '/@/api/sys/spu'

export default defineStore('app-spu', {
  state: (): any => {
    return {
      spuInfo: {},
    }
  },
  actions: {
    async getSpuList(params: any) {
      this.spuInfo = await reqSpuList(params)
    },

    clearSpuStore() {
      this.spuInfo = {}
    },
  },
  getters: {
    spuList(state) {
      return state.spuInfo.records
    },
  },
})
