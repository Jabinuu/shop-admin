<template>
  <BasicModal v-bind="$attrs" title="添加品牌" @ok="onOk">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="品牌名称"
        name="brandName"
        :rules="[
          { required: true, message: '请输入品牌名称！' },
          { pattern: /^\d{0,5}$/, message: '品牌名必须为数组，且限制在1-5之间！' },
        ]"
      >
        <a-input v-model:value="formState.brandName" />
      </a-form-item>

      <a-form-item label="品牌Logo" name="logo">
        <a-upload
          v-model:file-list="fileList"
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="/advanced-api/admin/product/fileUpload"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
    </a-form>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue'
  import { BasicModal } from '/@/components/Modal'
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
  import { message } from 'ant-design-vue'
  import type { UploadChangeParam, UploadProps } from 'ant-design-vue'
  interface FormState {
    brandName: string
  }

  function getBase64(img: Blob, callback: (base64Url: string) => void) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result as string))
    reader.readAsDataURL(img)
  }

  export default defineComponent({
    name: 'BrandModal',
    components: { BasicModal, LoadingOutlined, PlusOutlined },
    setup() {
      const fileList = ref([])
      const loading = ref<boolean>(false)
      const imageUrl = ref<string>('')
      const formState = reactive<FormState>({
        brandName: '',
      })

      const onFinish = (values: any) => {
        console.log('Success:', values)
      }

      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
      }

      const handleChange = (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
          loading.value = true
          return
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, (base64Url: string) => {
            imageUrl.value = base64Url
            loading.value = false
          })
        }
        if (info.file.status === 'error') {
          loading.value = false
          message.error('upload error')
        }
      }

      const beforeUpload = (file: UploadProps['fileList'][number]) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
          message.error('You can only upload JPG file!')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!')
        }
        return isJpgOrPng && isLt2M
      }

      const onOK = (e): void => {
        // 发请求
      }
      return {
        fileList,
        loading,
        imageUrl,
        formState,
        onFinish,
        onFinishFailed,
        handleChange,
        beforeUpload,
      }
    },
  })
</script>

<style lang="less" scoped>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
