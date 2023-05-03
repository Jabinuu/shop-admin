<template>
  <a-card class="card">
    <a-form layout="inline">
      <a-form-item label="一级分类">
        <a-select
          class="selectInput"
          placeholder="请输入"
          v-model:value="values.value1"
          :options="category1"
          style="width: 230px"
          @change="handleChange1"
          :disabled="props.isDisabled"
        >
        </a-select>
      </a-form-item>

      <a-form-item label="二级分类">
        <a-select
          class="selectInput"
          placeholder="请输入"
          v-model:value="values.value2"
          style="width: 230px"
          :options="category2"
          @change="handleChange2"
          :disabled="props.isDisabled"
        >
        </a-select>
      </a-form-item>

      <a-form-item label="三级分类">
        <a-select
          class="selectInput"
          placeholder="请输入"
          v-model:value="values.value3"
          style="width: 230px"
          :options="category3"
          @change="handleChange3"
          :disabled="props.isDisabled"
        >
        </a-select>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, reactive } from 'vue'
  import useCategoryStore from '/@/store/modules/category'
  import mitt from '/@/utils/useMitt'

  const emit = defineEmits(['showAddBtn'])
  const props = defineProps(['isDisabled'])
  const categoryStore = useCategoryStore()
  const keys = reactive({})
  const values = reactive({}) //三个分类的表单双向绑定值的数组
  const category1 = computed((): any[] => categoryStore.options1)
  const category2 = computed((): any[] => categoryStore.options2)
  const category3 = computed((): any[] => categoryStore.options3)
  let oldValue1 = '' // 更换上级分类前的上级分类名
  let oldValue2 = ''

  onMounted(() => {
    // 每当进入该组件，重置store数据
    categoryStore.$reset()
    categoryStore.getCategory1()
  })

  // 选择一级分类的选项的回调
  const handleChange1 = async (_, option) => {
    if (oldValue1 && option.value != values.value1.value) {
      values.value2 = undefined
      values.value3 = undefined
      emit('showAddBtn', false)
    }
    oldValue1 = option.value
    keys.id1 = option.id
    await categoryStore.getCategory2(option.id)
  }

  // 选择二级分类的选项的回调
  const handleChange2 = async (_, option) => {
    if (oldValue2 && option.value != values.value2.value) {
      values.value3 = undefined
      emit('showAddBtn', false)
    }
    oldValue2 = option.value
    keys.id2 = option.id
    await categoryStore.getCategory3(option.id)
  }

  const handleChange3 = (_, option) => {
    keys.id3 = option.id
    // 虽然keys和categoryIds的结构完全一样，但是切记千万不可直接将keys复制给categoryIds，这样会导致他们引用同一个对象！
    categoryStore.categoryIds = { id1: keys.id1, id2: keys.id2, id3: keys.id3 }
    mitt.emit('selected')
    emit('showAddBtn', true)
  }
</script>

<style lang="less" scoped>
  .card {
    margin: 10px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
  :deep(.ant-form-item-label > label) {
    font-size: 14px;
    font-weight: bold;
  }
  :deep(.selectInput) {
    margin-right: 10px;
  }
</style>
