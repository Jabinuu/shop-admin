<template>
  <div>
    <div class="customBase table-div">
      <a-button type="primary" class="addBrand" @click="onClickAddBrand"
        ><Icon icon="ant-design:plus-outlined"></Icon>添加</a-button
      >
      <a-table
        class="brandTable"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        bordered
      >
        <!-- bodyCell的{ column, text, record } 分别是列对象，单元格文本，单元格对应的数据源的数据项（响应式的）-->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'logoUrl'">
            <img :src="record.logoUrl" style="width: 50px; height: 50px" />
          </template>
          <template v-if="column.key === 'operation'">
            <a-button id="editBtn" @click="onEdit(record)"
              ><Icon icon="system-uicons:write"></Icon>修改</a-button
            >
            <a-button danger id="deleteBtn" @click="onClickRemove(record)"
              ><Icon icon="material-symbols:delete-outline"></Icon>删除</a-button
            >
          </template>
        </template>
      </a-table>

      <a-pagination
        class="pagination"
        v-model:current="current"
        :page-size-options="pageSizeOptions"
        :total="total"
        show-size-changer
        :page-size="pageSize"
        @showSizeChange="onShowSizeChange"
        @change="onPageChange"
      >
        <template #buildOptionText="props">
          <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
          <span v-else>全部</span>
        </template>
      </a-pagination>
    </div>
    <BrandModal @register="register" @added="onAdded" @edited="onEdited"></BrandModal>
  </div>
</template>

<script lang="ts">
  import '/@/design/customBase.less'
  import { ref, reactive, onMounted, toRefs, toRef, computed, watch, createVNode } from 'vue'
  import { Icon } from '/@/components/Icon'
  import BrandModal from '/@/components/Modal/src/BrandModal.vue'
  import { useBrandStore } from '/@/store/modules/brand'
  import { useModal } from '/@/components/Modal'
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
  import { message, Modal } from 'ant-design-vue'
  export default {
    name: 'BrandIndex',
    components: { Icon, BrandModal },

    setup() {
      const columns = [
        {
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          width: 70,
        },
        {
          title: '品牌名称',
          dataIndex: 'tmName',
          key: 'tmName',
          width: 300,
        },
        {
          title: '品牌LOGO',
          dataIndex: 'logoUrl',
          key: 'logoUrl',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
        },
      ]
      const [register, { openModal, setModalProps }] = useModal() // 数组也可以用[]解构
      const brandStore = useBrandStore()
      const pagination = reactive({
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '15', '20'],
      })
      const tableData = computed(() => brandStore.brandList)
      const total = computed(() => brandStore.brandTotal)
      const pages = computed(() => brandStore.maxPageNum)
      let isFirst = true
      watch(pages, async () => {
        // 监听页数发生变化，跳转到最新页码
        if (!isFirst) {
          pagination.current = pages.value
          await getBrandInfo()
        }
      })
      onMounted(() => {
        // 发送请求
        getBrandInfo().finally(() => (isFirst = false))
      })

      async function getBrandInfo() {
        await brandStore.getBrandInfo({
          page: pagination.current,
          pageSize: pagination.pageSize,
        })
      }

      // 已经添加完成后的回调
      async function onAdded() {
        pagination.current = pages.value
        await getBrandInfo()
      }

      // 已经修改完成后的回调
      async function onEdited() {
        await getBrandInfo()
      }

      // 每页展示条数变化，再次发请求
      async function onShowSizeChange(_, pageSize: Number) {
        pagination.pageSize = pageSize
        await getBrandInfo()
      }

      // 当前页码发生变化，再次发请求
      async function onPageChange(page: number, pageSize: number) {
        await getBrandInfo()
      }

      function onClickAddBrand() {
        openModal(true)
      }

      function onClickRemove(record) {
        Modal.confirm({
          title: '警告',
          icon: createVNode(ExclamationCircleOutlined),
          content: '你确定要删除品牌吗？',
          async onOk() {
            await brandStore.removeBrand({ id: record.id })
            message.success('删除品牌成功！')
            await getBrandInfo()
          },
          onCancel() {},
        })
      }

      async function onEdit(record) {
        const data = {
          id: record.id,
          tmName: record.tmName,
          url: record.logoUrl,
        }
        openModal(true, data)
      }

      return {
        tableData,
        columns,
        ...toRefs(pagination),
        total,
        register,
        openModal,
        onAdded,
        onEdited,
        onEdit,
        onShowSizeChange,
        onPageChange,
        onClickAddBrand,
        onClickRemove,
      }
    },
  }
</script>

<style lang="less" scoped>
  .addBrand {
    margin: 10px 0;
  }
  .brandTable {
    margin: 10px 10px 30px 0;
    // 因为scoped这里的样式只能修改本组件，修改不了子组件，要用深度选择器，实现样式穿透
    :deep(.ant-table-thead) > tr > th {
      font-weight: bold;
    }
    :deep(#editBtn) {
      margin-right: 10px;
      background-color: #40a9ff;
      color: white;
      border-radius: 4px;
    }
    :deep(#deleteBtn) {
      background-color: #ff4d4f;
      color: white;
      border-radius: 4px;
    }
  }
  .pagination {
    text-align: center;
  }
</style>
