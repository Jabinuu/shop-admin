<template>
  <a-form>
    <a-form-item label="属性名" style="font-weight: bold">
      <a-input placeholder="请输入属性名" style="width: 160px" v-model:value="attrName"></a-input>
    </a-form-item>

    <a-form-item>
      <!-- 后续把添加按钮单独封装为一个组件 -->
      <a-button type="primary" @click="onClickAddValue" class="btnMRight" :disabled="!attrName"
        ><Icon icon="ant-design:plus-outlined"></Icon>添加属性值</a-button
      >
    </a-form-item>

    <a-form-item>
      <a-table :columns="columns" :dataSource="dataSource" bordered>
        <!-- bodyCell的{ column, text, record } 分别是列对象，单元格文本，单元格对应的数据源的数据项（响应式的）-->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'valueName'">
            <a-input
              ref="valueNameinput"
              v-model:value="dataSource[record.id - 1].attrValue"
            ></a-input>
          </template>
          <template v-if="column.key === 'operation'">
            <a-button danger id="deleteBtn" @click="onClickRemove(record.id)"
              ><Icon icon="material-symbols:delete-outline"></Icon>删除</a-button
            >
          </template>
        </template>
      </a-table>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" class="btnMRight" :disabled="!isDisabledSave" @click="onClickSave"
        >保存</a-button
      >
      <a-button type="default" @click="onClickCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
  import { message } from 'ant-design-vue'
  import { reactive, ref, nextTick, onMounted, onUnmounted, computed } from 'vue'
  import useCategoryStore from '/@/store/modules/category'
  import { reqSaveAttr } from '/@/api/sys/category'
  import { Icon } from '/@/components/Icon'
  import mitt from '/@/utils/useMitt'
  const emit = defineEmits(['back'])
  const categoryStore = useCategoryStore()

  const attrName = ref(undefined)
  const isDisabledSave = ref<boolean>(false)
  const valueNameinput = ref()
  let attrValueList = []
  let attrOrder = 1
  let categoryLevel = 3
  const columns = reactive([
    { title: '序号', dataIndex: 'id', key: 'id' },
    { title: '属性值名称', dataIndex: 'valueName', key: 'valueName' },
    { title: '操作', dataIndex: 'operation', key: 'operation' },
  ])
  const dataSource = ref([])
  const categoryIds = computed(() => categoryStore.categoryIds)

  onMounted(() => {
    mitt.on('passEditData', initEditData)
  })

  onUnmounted(() => {
    mitt.off('passEditData', initEditData)
  })

  // 添加新的属性值，修改表格的行数据
  function onClickAddValue() {
    dataSource.value.push({ id: attrOrder++, attrValue: '' })
    isDisabledSave.value = true
    // 待渲染完成后再操作DOM, 输入框聚焦
    nextTick(() => valueNameinput.value.focus())
  }

  // 发起请求 保存新增的属性，
  function onClickSave() {
    const params = {
      attrName: attrName.value,
      attrValueList: dataSource.value.map((val) => ({
        valueName: val.attrValue,
        attrId: undefined,
      })),
      categoryId: categoryIds.value.id3,
      categoryLevel: categoryLevel,
    }

    reqSaveAttr(params).then(() => {
      message.success('添加属性成功！')
      emit('back')
      mitt.emit('selected', categoryIds.value)
      clearForm()
    })
  }

  // 返回属性展示组件
  function onClickCancel() {
    emit('back')
    clearForm()
  }

  // 删除某一个新增属性值
  function onClickRemove(id) {
    dataSource.value = dataSource.value.filter((item) => item.id !== id)
    dataSource.value.forEach((item) => {
      if (item.id > id) {
        item.id--
      }
    })
    attrOrder--
  }

  // 清空添加属性值表单
  function clearForm() {
    attrName.value = undefined
    dataSource.value = []
    attrOrder = 1
  }

  // 初始化修改属性值表单
  function initEditData(e) {
    e.attrValueList.forEach((item) => {
      dataSource.value.push({ id: attrOrder++, attrValue: item.valueName })
    })
    attrName.value = e.attrName
    isDisabledSave.value = true
  }
</script>

<style lang="less" scoped>
  .btnMRight {
    margin-right: 15px;
  }
  :deep(.ant-form-item-label > label) {
    font-size: 14px;
    font-weight: bold;
  }
  :deep(#deleteBtn) {
    background-color: #ff4d4f;
    color: white;
    border-radius: 4px;
  }
</style>
