<template>
  <div class="customBase">
    <a-button type="primary" @click="onClickAddSpu"
      ><Icon icon="ant-design:plus-outlined"></Icon>添加SPU</a-button
    >
    <a-table class="table" :columns="columns" :dataSource="spuList" bordered> </a-table>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import useSpuStore from '/@/store/modules/spu'
  import '/@/design/customBase.less'
  import { Icon } from '/@/components/Icon'
  import mitt from '/@/utils/useMitt'

  const spuStore = useSpuStore()
  const columns = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Spu名称', dataIndex: 'spuName', key: 'spuName', width: 100 },
    { title: 'Spu描述', dataIndex: 'description', key: 'description', width: 700 },
    { title: '操作', dataIndex: 'operation', key: 'operation' },
  ]
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
    spuStore.getSpuList({ page, limit, category3Id: e.id3 })
  }

  function onClickAddSpu() {}
</script>

<style lang="less" scoped>
  .table {
    margin-top: 15px;
    width: 100%;
  }
</style>
