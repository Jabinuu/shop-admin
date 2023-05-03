<template>
  <a-form :label-col="{ style: { width: '100px' } }" :colon="false">
    <a-form-item label="SPU名称">
      <span style="font-size: 18px; padding-left: 6px">{{ spuName }}</span>
    </a-form-item>
    <a-form-item label="SKU名称">
      <a-input placeholder="SKU名称" v-model:value="sku.skuName"></a-input>
    </a-form-item>
    <a-form-item label="价格(元)">
      <a-input placeholder="价格(元)" v-model:value="sku.price"></a-input>
    </a-form-item>
    <a-form-item label="重量(千克)">
      <a-input placeholder="重量(千克)" v-model:value="sku.weight"></a-input>
    </a-form-item>
    <a-form-item label="规格描述">
      <a-textarea placeholder="规格描述" v-model:value="sku.skuDesc" />
    </a-form-item>
    <a-form-item label="平台属性">
      <a-form-item
        :label-col="{ style: { width: '80px' } }"
        v-for="attrItem in attrInfo"
        :key="attrItem.id"
        :label="attrItem.attrName"
      >
        <!-- 当有多个表单要收集数据（双向绑定）时，最佳实践是将表单的值收集到数据源中对应的元素里 -->
        <a-select
          v-model:value="attrItem.attrIdAndValueId"
          style="width: 250px"
          :placeholder="`选择${attrItem.attrName}`"
        >
          <a-select-option
            v-for="attrValue in attrItem.attrValueList"
            :value="`${attrValue.id}:${attrItem.id}`"
            :key="attrValue.id"
          >
            {{ attrValue.valueName }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form-item>
    <a-form-item label="销售属性">
      <a-form-item
        :label-col="{ style: { width: '80px' } }"
        v-for="saleAttr in spuSaleAttrList"
        :key="saleAttr.id"
        :label="saleAttr.saleAttrName"
      >
        <a-select
          v-model:value="saleAttr.valueIdAndSaleId"
          style="width: 250px"
          :placeholder="`选择${saleAttr.saleAttrName}`"
        >
          <a-select-option
            :value="`${valueItem.id}:${valueItem.baseSaleAttrId}:${valueItem.saleAttrValueName}`"
            v-for="valueItem in saleAttr.spuSaleAttrValueList"
            :key="valueItem.id"
          >
            {{ valueItem.saleAttrValueName }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form-item>
    <a-form-item label="图片列表">
      <a-table
        :columns="columns"
        :data-source="spuImageList"
        :row-selection="rowSelection"
        bordered
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'imgUrl'">
            <img :src="record.imgUrl" style="width: 100px" />
          </template>
          <template v-if="column.key === 'operation'">
            <a-button type="primary" @click="onClickSetDefaultImg(record)">设为默认</a-button>
          </template>
        </template>
      </a-table>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 3, offset: 1 }">
      <a-button type="primary" @click="onClickSave">保存</a-button>
      <a-button style="margin-left: 10px" @click="onClickCancel">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
  import mitt from '/@/utils/useMitt'
  import useSpuStore from '/@/store/modules/spu'
  import useCategoryStore from '/@/store/modules/category'
  import { message } from 'ant-design-vue'

  const emit = defineEmits(['change'])
  const spuStore = useSpuStore()
  const categoryStore = useCategoryStore()
  const attrInfo = ref([])
  const spuName = ref<string>('')
  const spuSaleAttrList = ref([])
  const spuImageList = computed(() =>
    spuStore.spuImageList.map((item) => {
      item.key = item.id
      return item
    }),
  )
  const skuForm = ref()
  const sku = ref({})
  const attrId = ref('')
  const columns = [
    { title: '图片', dataIndex: 'imgUrl', key: 'imgUrl' },
    { title: '名称', dataIndex: 'imgName', key: 'imgName' },
    { title: '操作', dataIndex: 'operation', key: 'operation' },
  ]
  const rowSelection = ref({
    checkStrictly: false,
    onSelect: (record: DataItem, selected: boolean) => {
      if (selected) {
        const temp = JSON.parse(JSON.stringify(record).replace(/id/g, 'spuImgId'))
        temp.isDefault = 0
        sku.value.skuImageList.push(temp)
      } else {
        sku.value.skuImageList = sku.value.skuImageList.filter(
          (item) => item.spuImgId !== record.id,
        )
      }
    },
    onSelectAll: (selected: boolean, changeRows: DataItem[]) => {
      sku.value.skuImageList = []
      if (selected) {
        changeRows.forEach((item) => {
          const temp = JSON.parse(JSON.stringify(item).replace(/id/g, 'spuImgId'))
          temp.isDefault = 0
          sku.value.skuImageList.push(temp)
        })
      }
    },
  })
  // 监听3id的变化，3id变化说明分类发生更改
  watch(
    () => categoryStore.category3Id,
    async () => {
      attrInfo.value = await categoryStore.getAttrInfoList({
        id1: categoryStore.category1Id,
        id2: categoryStore.category2Id,
        id3: categoryStore.category3Id,
      })
    },
    { immediate: true },
  )

  onMounted(() => {
    mitt.on('passSpuInfo', getBaseSpuInfo)
  })

  onUnmounted(() => {
    mitt.off('passSpuInfo', getBaseSpuInfo)
  })

  async function getBaseSpuInfo(e) {
    spuStore.getSpuImageList(e.spuId)
    spuName.value = e.spuName

    const { tmId, spuSaleAttrList: tempSaleAttrList } = await spuStore.getSpuById(e.spuId)
    spuSaleAttrList.value = tempSaleAttrList
    // 声明的是_避免spuName暂时性死区引起的报错
    const { spuName: _, ...tt } = Object.assign(e, { tmId })
    sku.value = Object.assign(sku.value, tt, { skuImageList: [] })
  }

  function onClickSetDefaultImg(record) {
    sku.value.skuImageList.forEach((item) => {
      if (item.spuImgId === record.id) {
        item.isDefault = 1
        sku.value.skuDefaultImg = item.imgUrl
      }
    })
  }

  async function onClickSave() {
    // 处理选择器收集的数据 ‘id1：id2’
    spuSaleAttrList.value.forEach((item) => {
      const tt = item.valueIdAndSaleId.split(':')
      item.saleAttrId = parseInt(tt[0])
      item.saleAttrValueId = parseInt(tt[1])
      item.saleAttrValueName = tt[2]
    })
    sku.value.skuSaleAttrValueList = spuSaleAttrList.value

    attrInfo.value.forEach((item) => {
      const tt = item.attrIdAndValueId.split(':')
      item.attrId = parseInt(tt[1])
      item.valueId = parseInt(tt[0])
    })
    sku.value.skuAttrValueList = attrInfo.value
    sku.value.price = parseInt(sku.value.price)
    await spuStore.saveSku({})
    message.success('添加Sku成功！')
    skuForm.value.resetFields()
  }

  function onClickCancel() {
    sku.value = []
    attrInfo.value.forEach((item) => (item.attrIdAndValueId = undefined))
    spuSaleAttrList.value.forEach((item) => (item.valueIdAndSaleId = undefined))
    emit('change', 'SpuTable')
  }
</script>

<style lang="less" scoped>
  :deep(.ant-form-item-label > label) {
    font-size: 14px;
    font-weight: bold;
  }
</style>
