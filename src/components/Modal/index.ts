import { withInstall } from '/@/utils'
import './src/index.less'
import basicModal from './src/BasicModal.vue'

// withInstall() 注册basicModal为app全局组件
export const BasicModal = withInstall(basicModal)
export { useModalContext } from './src/hooks/useModalContext'
export { useModal, useModalInner } from './src/hooks/useModal'
export * from './src/typing'
