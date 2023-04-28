// 通用的确定操作对话框

import { Modal } from 'ant-design-vue'
import { createVNode } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
export const confirmDialog = (callback: any, content: string): void => {
  Modal.confirm({
    title: '警告',
    icon: createVNode(ExclamationCircleOutlined),
    content,
    onOk() {
      // 返回一个promise以实现延迟关闭对话框的效果
      // 普通函数没有返回值，默认返回undefined；异步函数没有返回值，则默认返回一个值为undefined的promise对象
      return callback()
    },
    onCancel() {},
  })
}
