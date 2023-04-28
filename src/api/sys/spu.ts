import { defHttp } from '/@/utils/http/axios'

enum Api {
  spuList = '/admin/product',
}

export const reqSpuList = (params: any) => {
  const { page, limit, ...query } = params
  return defHttp.get(
    {
      url: `${Api.spuList}/${page}/${limit}`,
      params: query,
    },
    {
      errorMessageMode: 'message',
    },
  )
}
