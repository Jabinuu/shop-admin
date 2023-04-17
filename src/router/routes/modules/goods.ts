import type { AppRouteModule } from '/@/router/types'
import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const goodsRoutes: AppRouteModule = {
  path: '/goods',
  name: 'goods',
  component: LAYOUT,
  meta: {
    orderNo: 20,
    title: t('routes.goods.goods'),
    icon: 'ant-design:shopping-filled',
  },
  children: [
    {
      path: 'brand',
      name: 'brand',
      component: () => import('/@/views/goods/brand/index.vue'),
      meta: { title: t('routes.goods.brand'), orderNo: 10 },
    },
    {
      path: 'platform',
      name: 'platform',
      component: () => import('/@/views/goods/platform/index.vue'),
      meta: { title: t('routes.goods.platform'), orderNo: 20 },
    },
    {
      path: 'spu',
      name: 'spu',
      component: () => import('/@/views/goods/sku/index.vue'),
      meta: { title: t('routes.goods.spu'), orderNo: 30 },
    },
    {
      path: 'sku',
      name: 'sku',
      component: () => import('/@/views/goods/spu/index.vue'),
      meta: { title: t('routes.goods.sku'), orderNo: 40 },
    },
  ],
}

export default goodsRoutes
