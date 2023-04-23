import { defHttp } from '/@/utils/http/axios'
import { BasicPageParams } from '/@/api/model/baseModel'
import { BrandList } from 'types/store'

enum Api {
  BrandList = '/admin/product/baseTrademark',
  AddBrand = '/admin/product/baseTrademark/save',
  UploadLogo = '/admin/product/fileUpload',
  RemoveBrand = '/admin/product/baseTrademark/remove',
}

export function reqBrandInfo(params: BasicPageParams) {
  return defHttp.get(
    {
      url: `${Api.BrandList}/${params.page}/${params.pageSize}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export function reqAddBrand(params: BrandList) {
  return defHttp.post(
    {
      url: Api.AddBrand,
      params,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export function reqUploadLogo(formData: object) {
  return defHttp.post(
    {
      url: Api.UploadLogo,
      data: formData,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export function reqRemoveBrand(params: { id: number }) {
  return defHttp.delete(
    {
      url: `${Api.RemoveBrand}/${params.id}`,
    },
    {
      errorMessageMode: 'message',
    },
  )
}

export function reqUpdateBrand(params: BrandList) {
  return defHttp.put(
    {
      url: '/admin/product/baseTrademark/update',
      params,
    },
    {
      errorMessageMode: 'message',
    },
  )
}
