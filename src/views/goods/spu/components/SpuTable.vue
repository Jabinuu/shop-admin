<template>
  <div class="customBase">
    <a-button type="primary" @click="onClickAddSpu"
      ><Icon icon="ant-design:plus-outlined"></Icon>添加SPU</a-button
    >
    <a-table class="table" :columns="columns" :data-source="spuList" bordered>
      <template #bodyCell="{ record, column }">
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
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
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
  const addBtnState = ref<boolean>(false)
  const spuList = computed(() => spuStore.spuList)
  const page = 1
  const limit = 10
  onMounted(() => {
    mitt.on('selected', getSpuList)
  })

  onUnmounted(() => {
    spuStore.clearSpuStore()
    mitt.off('selected', getSpuList)
  })

  // 获取用于展示的spu数据列表
  function getSpuList(e) {
    addBtnState.value = spuStore.getSpuList({ page, limit, category3Id: e.id3 })
  }

  function onClickAddSpu() {
    emit('change', 'SpuAdd')
  }

  function onClickAddSku() {
    emit('change', 'SkuAdd')
  }

  function onClickUpdateSpu() {
    emit('change', 'SpuAdd')
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
</style>
