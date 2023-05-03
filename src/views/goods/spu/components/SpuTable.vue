<template>
  <div class="customBase">
    <a-button type="primary" @click="onClickAddSpu" :disabled="!showAddBtn"
      ><Icon icon="ant-design:plus-outlined"></Icon>添加SPU</a-button
    >
    <a-table class="table" :columns="columns" :data-source="spuList" bordered :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-button class="marginR" type="success" @click="onClickAddSku(record)" title="添加Sku"
            ><Icon icon="ant-design:plus-outlined"></Icon></a-button
          ><a-button
            class="marginR"
            type="warning"
            @click="onClickUpdateSpu(record)"
            title="修改Spu"
            ><Icon icon="system-uicons:write"></Icon></a-button
          ><a-button
            class="marginR"
            type="info"
            @click="onClickSkuList"
            title="查看当前Spu的Sku列表"
            ><Icon icon="ant-design:info-circle-outlined"></Icon
          ></a-button>
          <a-button class="marginR" type="danger" @click="onClickRemoveSpu(record)" title="删除Spu"
            ><Icon icon="material-symbols:delete-outline"></Icon
          ></a-button>
        </template>
      </template>
    </a-table>

    <a-pagination
      class="center"
      v-model:current="curPage"
      v-model:page-size="pageSize"
      :page-size-options="pageSizeOptions"
      :total="total"
      show-size-changer
      @change="onChangePage"
    >
      <template #buildOptionText="props">
        <span v-if="props.value !== '20'">{{ props.value }}条/页</span>
        <span v-else>全部</span>
      </template>
    </a-pagination>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
  import useSpuStore from '/@/store/modules/spu'
  import useCategoryStore from '/@/store/modules/category'
  import '/@/design/customBase.less'
  import { Icon } from '/@/components/Icon'
  import mitt from '/@/utils/useMitt'
  import { confirmDialog } from '/@/hooks/component/useConfirmDialog'
  import { message } from 'ant-design-vue'

  const emit = defineEmits(['change'])
  const spuStore = useSpuStore()
  const categoryStore = useCategoryStore()

  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Spu名称', dataIndex: 'spuName', key: 'spuName', width: 400 },
    { title: 'Spu描述', dataIndex: 'description', key: 'description', width: 400 },
    { title: '操作', dataIndex: 'operation', key: 'operation' },
  ]
  const pageSizeOptions = ref<string[]>(['5', '10', '15', '20'])
  const props = defineProps(['showAddBtn'])
  const spuList = computed(() => spuStore.spuList)
  const curPage = ref<number>(1)
  const pageSize = ref<number>(5)
  const total = computed(() => spuStore.spuInfo.total)

  // 分类改变时，清空store
  // 注意：watch能监听ref，getter函数，reactive,计算属性。不能直接监听响应式对象的属性，这时可以写一个getter函数或者toRef()来解决
  watch(
    () => props.showAddBtn,
    (val) => {
      if (!val) {
        spuStore.clearSpuStore()
      }
    },
  )

  onMounted(() => {
    mitt.on('selected', getSpuList)
    mitt.on('updataTable', updateTable)
    spuStore.getBrandList()
    spuStore.getSaleAttrList()
  })

  onUnmounted(() => {
    spuStore.clearSpuStore()
    mitt.off('updataTable', updateTable)
    mitt.off('selected', getSpuList)
  })

  // 获取用于展示的spu数据列表
  async function getSpuList() {
    await spuStore.getSpuList({
      page: curPage.value,
      limit: pageSize.value,
      category3Id: categoryStore.category3Id,
    })
  }

  const onChangePage = (current: number, pageSize: number) => {
    getSpuList()
  }

  function onClickAddSpu() {
    emit('change', 'SpuAdd')
    nextTick(() => mitt.emit('addNewSpu', categoryStore.category3Id))
  }

  function onClickAddSku(e) {
    emit('change', 'SkuAdd')
    nextTick(() =>
      mitt.emit('passSpuInfo', { spuId: e.id, category3Id: e.category3Id, spuName: e.spuName }),
    )
  }

  async function onClickUpdateSpu(e) {
    let temp = await spuStore.getSpuById(e.id)
    temp.tmSelector = await spuStore.getBrandById(temp.tmId)
    emit('change', 'SpuAdd')
    nextTick(() => mitt.emit('updateSpu', temp))
  }

  function updateTable() {
    getSpuList()
  }

  function onClickSkuList() {}

  function onClickRemoveSpu(e) {
    confirmDialog(async () => {
      await spuStore.removeSpu(e.id)
      message.success('删除Spu成功！')
      await getSpuList()
    }, '确定要删除Spu吗？')
  }
</script>

<style lang="less" scoped>
  .table {
    margin-top: 15px;
    width: 100%;
    :deep(.marginR) {
      margin-right: 16px;
    }
  }
  .center {
    margin-top: 20px;
    text-align: center;
  }
</style>
