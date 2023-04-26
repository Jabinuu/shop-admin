import type { App } from 'vue'
import { Button } from './Button'
import Categories from '/@/components/CategoriesSelect/index.vue'

import { Input, Layout, Table, Pagination, Upload, Form, Card, Select, Tag } from 'ant-design-vue'
export function registerGlobComp(app: App) {
  app
    .use(Input)
    .use(Button)
    .use(Layout)
    .use(Table)
    .use(Pagination)
    .use(Upload)
    .use(Form)
    .use(Card)
    .use(Select)
    .use(Tag)
  app.component('Categories', Categories)
}
