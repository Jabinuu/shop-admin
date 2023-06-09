<template>
  <div>
    <a-button type="primary" @click="onClickAddAttr" :disabled="!props.showAddBtn"
      ><Icon icon="ant-design:plus-outlined"></Icon>添加属性</a-button
    >
    <a-table :data-source="attrInfoList" :columns="columns" bordered class="table">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'attrValueList'">
          <a-tag
            class="tags"
            v-for="item in record.attrValueList"
            :key="item.id"
            :color="'green'"
            >{{ item.valueName }}</a-tag
          >
        </template>

        <template v-if="column.key === 'operation'">
          <a-button id="editBtn" @click="onEdit(record)"
            ><Icon icon="system-uicons:write"></Icon>修改</a-button
          >
          <a-button danger id="deleteBtn" @click="onClickRemove(record.id)"
            ><Icon icon="material-symbols:delete-outline"></Icon>删除</a-button
          >
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, reactive, ref, toRef, watch } from 'vue'
  import mitt from '/@/utils/useMitt'
  import { Icon } from '/@/components/Icon'
  import useCategoryStore from '/@/store/modules/category'
  import { reqRemoveAttr } from '/@/api/sys/category'
  import { message } from 'ant-design-vue'
  import { confirmDialog } from '/@/hooks/component/useConfirmDialog'

  const attrInfoList = ref([])
  const categoryStore = useCategoryStore()
  const categoryIds = computed(() => categoryStore.categoryIds)
  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 100 },
    { title: '属性名称', dataIndex: 'attrName', key: 'attrName', width: 120 },
    { title: '属性值列表', dataIndex: 'attrValueList', key: 'attrValueList', width: 700 },
    { title: '操作', dataIndex: 'operation', key: 'operation' },
  ]
  // defineEmits无须引入，可直接使用，返回一个可触发已定义事件的函数
  const emit = defineEmits(['change'])
  const props = defineProps(['showAddBtn'])
  watch(toRef(props, 'showAddBtn'), (value) => {
    if (!value) {
      attrInfoList.value = []
    }
  })
  onMounted(() => {
    // 注册事件
    mitt.on('selected', getAttrInfoList)
  })

  // 退出（卸载）该组件后，一定要移除这个组件的事件响应
  onUnmounted(() => {
    mitt.off('selected', getAttrInfoList)
  })

  // 获取分类商品信息列表
  async function getAttrInfoList() {
    attrInfoList.value = await categoryStore.getAttrInfoList({
      id1: categoryIds.value.id1,
      id2: categoryIds.value.id2,
      id3: categoryIds.value.id3,
    })
  }

  async function onClickAddAttr() {
    emit('change', true)
  }

  async function onEdit(record) {
    const params = {
      attrName: record.attrName,
      attrValueList: record.attrValueList,
    }
    emit('change', true)
    nextTick(() => mitt.emit('passEditData', params))
  }

  async function onClickRemove(attrId) {
    confirmDialog(async () => {
      await reqRemoveAttr(attrId)
      message.success('删除属性成功！')
      await getAttrInfoList(categoryIds.value)
    }, '确定要删除该属性吗？')
  }
</script>

<style lang="less" scoped>
  .table {
    margin-top: 15px;
    width: 100%;
    .tags {
      font-size: 14px;
      line-height: 28px;
      margin-right: 20px;
    }
    :deep(.ant-table-thead) > tr > th {
      font-weight: bold;
    }

    :deep(#editBtn) {
      margin-right: 10px;
      background-color: #ffa500;
      opacity: 0.8;
      color: white;
      border-radius: 4px;
    }
    :deep(#deleteBtn) {
      background-color: #ff4d4f;
      color: white;
      border-radius: 4px;
    }
  }
</style>
