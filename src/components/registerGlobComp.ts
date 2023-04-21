import type { App } from 'vue'
import { Button } from './Button'
import { Input, Layout, Table, Pagination, Modal, Upload, Form } from 'ant-design-vue'
export function registerGlobComp(app: App) {
  app.use(Input).use(Button).use(Layout).use(Table).use(Pagination).use(Modal).use(Upload).use(Form)
}
