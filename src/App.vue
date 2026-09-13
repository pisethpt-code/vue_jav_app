<script setup>
import { ref, onBeforeUpdate, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import FileUploader from './components/FileUploader.vue';

const BASE_URL = import.meta.env.VITE_API_URL
const endpoint_loadLandPercel = ref('api/v1/mes/order/getData')
const endpoint_upload = ref('api/v1/mes/order/fileUpload')

const materialCode = ref('200330')
const batchNumber = ref('C26B01')

const uploaderRefs = ref([])
const filesUploaded = reactive({
  excel: null,
  json: null,
  pdf: null
})

const handleGetLandParcelList = async () => {

  ElMessage({
    message: '打开地块列表',
    type: 'primary',
    icon: ''
  })

  // try {
  //   const response = await fetch(BASE_URL + endpoint_loadLandPercel);
  //   if (!response.ok) {
  //     throw new Error(`${(await response).status}`)
  //   }

  //   const data = await response.json();
  //   ElMessage.success('成功')
  // } catch (error) {
  //   ElMessage.error(error)
  //   console.error(error)
  // }
}

const handleRefresh = () => {
  ElMessage.primary('页面已刷新')

  // window.location.reload()
}

const handleSubmit = async () => {
  if (!materialCode.value || materialCode.value === null || materialCode.value.trim() === '') {
    ElMessage.error('物料编码不能为空')
    return
  }

  if (batchNumber.value === null || batchNumber.value.trim() === '') {
    ElMessage.error('天然胶批次不能为空')
    return
  }

  if (filesUploaded.excel === null && filesUploaded.json === null && filesUploaded.pdf === null) {
    ElMessage.error('请上传以下文件：EXCEL、JSON、PDF')
    return
  }

  try {
    const filePayloads = {
      excelFile: filesUploaded.excel?.file || null,
      jsonFile: filesUploaded.json?.file || null,
      pdfFile: filesUploaded.pdf?.file || null
    }

    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        materialCode: materialCode.value,
        batchNumber: batchNumber.value,
        filePayload: filePayloads
      })
    }

    console.log(JSON.stringify(option));

    // const response = await fetch(BASE_URL + endpoint_upload, option);
    // if (!response.ok) {
    //   throw new Error(`${response.status}`)
    // }

    // const data = await response.json();

    ElMessage.success('成功')
  } catch (error) {
    ElMessage.error(error)
    console.error(error)
  }
}

const handleResetAll = () => {
  ElMessageBox.confirm(
    '确定要重置所有内容吗？已上传的文件将被清除。',
    {
      distinguishCancelAndClose: true,
      confirmButtonText: '是的',
      cancelButtonText: '取消',
    }
  )
    .then(() => {
      uploaderRefs.value.forEach((uploader) => {
        uploader?.reset()
      })

      filesUploaded.excel = null;
      filesUploaded.json = null;
      filesUploaded.pdf = null;

      materialCode.value = '';
      batchNumber.value = '';

      ElMessage({
        type: 'primary',
        message: '已重置',
      })
    })
    .catch((action) => {
    })
}

const setUploaderRef = (el) => {
  if (el) {
    uploaderRefs.value.push(el)
  }
}

onBeforeUpdate(() => {
  uploaderRefs.value = []
})

const handleFileUploadChange = (type, payload) => {
  filesUploaded[type] = payload;

  console.log(JSON.stringify(filesUploaded));
}

</script>

<template>
  <div style="display: flex; flex-direction: column; margin: 15px; gap: 10px;">

    <!-- main buttons -->
    <el-card class="card-background">
      <el-button @click="handleGetLandParcelList" class="text-color"
        style="background-color: #40a9ff">📋地块列表</el-button>
      <el-button @click="handleRefresh" class="text-color" style="background-color: #73d13d">🔄刷新</el-button>
    </el-card>

    <!-- input fields blocks -->
    <el-card class="card-background">
      <div style="display: flex !important; flex-wrap: wrap; flex-direction: row !important; gap: 15px">
        <div style="display: flex; flex-wrap: wrap; flex-direction: row; gap: 10px; align-items: center !important;">
          <label for="materialCode"><em style="color: red !important;">* </em>物料编码:</label>
          <el-input v-model="materialCode" style="width: 240px;" placeholder="请输入物料编码" />
        </div>

        <div style="display: flex; flex-wrap: wrap; flex-direction: row; gap: 10px; align-items: center !important;">
          <label for="batchNumber"><em style="color: red !important;">* </em>天然胶批次:</label>
          <el-input v-model="batchNumber" style="width: 240px" placeholder="请输入批次号" />
        </div>
      </div>
    </el-card>

    <!-- uploads block -->
    <el-card class="card-background">
      <template #header>
        <div class="card-header">
          <span style="font-weight: bold">文件上传</span>
        </div>
      </template>

      <!-- excel accept files-->
      <FileUploader :ref="setUploaderRef" @upload-success="(data) => handleFileUploadChange('excel', data)"
        @file-deleted="() => handleFileUploadChange('excel', null)" label-text="地块信息EXCEL" format-text="EXCEL"
        allowed-extensions=".xlsx,.xls" allowed-types-text=".xlsx / .xls" />

      <!-- json accept file-->
      <FileUploader :ref="setUploaderRef" @upload-success="(data) => handleFileUploadChange('json', data)"
        @file-deleted="() => handleFileUploadChange('json', null)" label-text="地块信息JSON还没传" format-text="JSON"
        allowed-extensions=".json" allowed-types-text=".json" :max-size-m-b="5" />

      <!-- pdf accept file -->
      <FileUploader :ref="setUploaderRef" @upload-success="(data) => handleFileUploadChange('pdf', data)"
        @file-deleted="() => handleFileUploadChange('pdf', null)" label-text="尽职声明PDF未上传" format-text="PDF"
        allowed-extensions=".pdf" allowed-types-text=".pdf" :max-size-m-b="20" />
    </el-card>

    <!-- action buttons -->
    <el-card class="card-background">
      <div
        style="display: flex !important; flex-direction: row !important; gap: 5px; justify-content: center !important;">
        <el-button @click="handleResetAll">重置</el-button>
        <el-button @click="handleSubmit" type="primary">提交上传</el-button>
      </div>
    </el-card>
  </div>
</template>

<style>
.text-color {
  color: white;
}

.card-background {
  background-color: white !important;
}
</style>