import { defHttp } from '/@/utils/http/axios'

enum Api {
  SpuList = '/admin/product',
  SpuById = '/admin/product/getSpuById/',
  BaseSaleAttrList = '/admin/product/baseSaleAttrList',
  SpuImgList = '/admin/product/spuImageList/',
  SaveSpuInfo = '/admin/product/saveSpuInfo',
  BrandList = '/admin/product/baseTrademark/getTrademarkList',
  BrandById = '/admin/product/baseTrademark/get/',
  RemoveSpu = '/admin/product/deleteSpu/',
  SpuImageList = '/admin/product/spuImageList/',
  SaveSku = '/admin/product/saveSkuInfo',
}

export const reqSpuList = (params: any) => {
  const { page, limit, ...query } = params
  return defHttp.get(
    {
      url: `${Api.SpuList}/${page}/${limit}`,
      params: query,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqSpuById = (params: any) => {
  return defHttp.get(
    {
      url: `${Api.SpuById}${params}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqBaseSaleAttrList = () => {
  return defHttp.get(
    {
      url: Api.BaseSaleAttrList,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqSpuImgList = (params: any) => {
  return defHttp.get(
    {
      url: `${Api.SpuImgList}${params}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqSaveSpuInfo = (params: any) => {
  return defHttp.post(
    {
      url: `${Api.SaveSpuInfo}`,
      params,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqBrandList = () => {
  return defHttp.get(
    {
      url: Api.BrandList,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqBrandById = (params: any) => {
  return defHttp.get(
    {
      url: `${Api.BrandById}${params}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqRemoveSpu = (params: any) => {
  return defHttp.delete(
    {
      url: `${Api.RemoveSpu}${params}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqSpuImageList = (params: any) => {
  return defHttp.get(
    {
      url: `${Api.SpuImageList}${params}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export const reqSaveSku = (params: any) => {
  return defHttp.post(
    {
      url: `${Api.SaveSku}`,
      params,
    },
    {
      errorMessageMode: 'message',
    },
  )
}
