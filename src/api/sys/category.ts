import { defHttp } from '/@/utils/http/axios'

enum Api {
  Category1 = '/admin/product/getCategory1/',
  Category2 = '/admin/product/getCategory2/',
  Category3 = '/admin/product/getCategory3/',
  AttrInfoList = '/admin/product/attrInfoList/',
  saveAttr = '/admin/product/saveAttrInfo',
  removeAttr = '/admin/product/deleteAttr/',
}

interface baseAttrInfo {
  attrName: string
  attrValueList: { attrid: number; valueName: string }
  categoryId: number
  categoryLevel: number
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
      url: `${Api.AttrInfoList}${params.id1}/${params.id2}/${params.id3}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqSaveAttr = (params: baseAttrInfo) => {
  return defHttp.post(
    {
      url: `${Api.saveAttr}`,
      params,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqRemoveAttr = (attrId: number) => {
  return defHttp.delete(
    {
      url: `${Api.removeAttr}${attrId}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}
