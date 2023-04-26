import { defineStore } from 'pinia'
import { reqCategory1, reqCategory2, reqCategory3 } from '/@/api/sys/category'

interface op {
  value: string
  label: string
  id: number
}

interface Category1 {
  id: number
  name: string
}

interface Category2 {
  category1Id: number
  id: number
  name: string
}

interface Category3 {
  category2Id: number
  id: number
  name: string
}

interface CategoryInfo {
  category1: Category1[]
  category2: Category2[]
  category3: Category3[]
}

export default defineStore('app-category', {
  state: (): CategoryInfo => {
    return {
      category1: [],
      category2: [],
      category3: [],
    }
  },
  actions: {
    async getCategory1() {
      const data = await reqCategory1()
      this.category1 = data
    },
    async getCategory2(Category1Id: number) {
      const data = await reqCategory2(Category1Id)
      this.category2 = data
    },
    async getCategory3(Category2Id: number) {
      const data = await reqCategory3(Category2Id)
      this.category3 = data
    },
  },
  getters: {
    options1() {
      const options: op[] = []
      this.category1.forEach((item) => {
        options.push({
          value: item.name,
          label: item.name,
          id: item.id,
        })
      })
      return options
    },
    options2() {
      const options: op[] = []
      this.category2.forEach((item) => {
        options.push({
          value: item.name,
          label: item.name,
          id: item.id,
        })
      })
      return options
    },
    options3() {
      const options: op[] = []
      this.category3.forEach((item) => {
        options.push({
          value: item.name,
          label: item.name,
          id: item.id,
        })
      })
      return options
    },
  },
})
