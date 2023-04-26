import { defHttp } from '/@/utils/http/axios'

enum Api {
  Category1 = '/admin/product/getCategory1/',
  Category2 = '/admin/product/getCategory2/',
  Category3 = '/admin/product/getCategory3/',
}

export const reqCategory1 = () => {
  return defHttp.get(
    {
      url: `${Api.Category1}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqCategory2 = (category1Id: number) => {
  return defHttp.get(
    {
      url: `${Api.Category2}${category1Id}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqCategory3 = (category2Id: number) => {
  return defHttp.get(
    {
      url: `${Api.Category3}${category2Id}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqAttrInfoList = (params: { id1: number; id2: number; id3: number }) => {
  return defHttp.get(
    {
      url: `/admin/product/attrInfoList/${params.id1}/${params.id2}/${params.id3}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}
