import { defHttp } from '/@/utils/http/axios'
import { BasicPageParams } from '/@/api/model/baseModel'

enum Api {
  BrandList = '/admin/product/baseTrademark',
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
