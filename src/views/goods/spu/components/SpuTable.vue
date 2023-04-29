<template>
  <div class="customBase">
    <a-button type="primary" @click="onClickAddSpu" :disabled="!showAddBtn"
      ><Icon icon="ant-design:plus-outlined"></Icon>添加SPU</a-button
    >
    <a-table class="table" :columns="columns" :data-source="spuList" bordered :pagination="false">
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'operation'">
          <a-button class="marginR" type="success" @click="onClickAddSku" title="添加Sku"
            ><Icon icon="ant-design:plus-outlined"></Icon></a-button
          ><a-button class="marginR" type="warning" @click="onClickUpdateSpu" title="修改Spu"
            ><Icon icon="system-uicons:write"></Icon></a-button
          ><a-button
            class="marginR"
            type="info"
            @click="onClickSkuList"
            title="查看当前Spu的Sku列表"
            ><Icon icon="ant-design:info-circle-outlined"></Icon
          ></a-button>
          <a-button class="marginR" type="danger" @click="onClickRemoveSpu" title="删除Spu"
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
  import '/@/design/customBase.less'
  import { Icon } from '/@/components/Icon'
  import mitt from '/@/utils/useMitt'

  const emit = defineEmits(['change'])
  const spuStore = useSpuStore()
  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Spu名称', dataIndex: 'spuName', key: 'spuName', width: 400 },
    { title: 'Spu描述', dataIndex: 'description', key: 'description', width: 400 },
    { title: '操作', dataIndex: 'operation', key: 'operation' },
  ]
  const pageSizeOptions = ref<string[]>(['5', '10', '15', '20'])
  const addBtnState = ref<boolean>(false)
  const props = defineProps(['showAddBtn'])
  const spuList = computed(() => spuStore.spuList)
  const curPage = ref<number>(1)
  const pageSize = ref<number>(5)
  const total = computed(() => spuStore.spuInfo.total)
  let category3Id = undefined

  watch(toRef(props, 'showAddBtn'), (val) => {
    if (!val) {
      spuStore.clearSpuStore()
    }
  })

  onMounted(() => {
    mitt.on('selected', getSpuList)
  })

  onUnmounted(() => {
    spuStore.clearSpuStore()
    mitt.off('selected', getSpuList)
  })

  // 获取用于展示的spu数据列表
  function getSpuList(e) {
    category3Id = e.id3
    addBtnState.value = spuStore.getSpuList({
      page: curPage.value,
      limit: pageSize.value,
      category3Id,
    })
  }

  const onChangePage = (current: number, pageSize: number) => {
    getSpuList({ id3: category3Id })
  }

  function onClickAddSpu() {
    emit('change', 'SpuAdd')
    nextTick(() => mitt.emit('passId3', category3Id))
  }

  function onClickAddSku(category3Id) {
    emit('change', 'SkuAdd')
  }

  function onClickUpdateSpu() {
    emit('change', 'SpuAdd')
    nextTick(() => mitt.emit('passId3', category3Id))
  }

  function onClickSkuList() {}

  function onClickRemoveSpu() {}
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
