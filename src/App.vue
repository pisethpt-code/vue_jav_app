<script setup>
import { ref } from 'vue'

const materialCode = ref('200330')
const batchNumber = ref('C26B01')

const xlsxFile = ref('')
const jsonFile = ref('')
const pdfFile = ref('')

</script>

<template>
  <div style="display: flex; flex-direction: column; margin: 15px; gap: 10px">

    <!-- main buttons -->
    <el-card class="card-background">
      <el-button class="text-color" style="background-color: #40a9ff">📋地块列表</el-button>
      <el-button class="text-color" style="background-color: #73d13d">🔄刷新</el-button>
    </el-card>

    <!-- input fields blocks -->
    <el-card class="card-background">
      <div style="display: flex !important; flex-direction: row !important; gap: 15px">
        <div style="display: flex; flex-direction: row; gap: 10px; align-items: center !important;">
          <label for="materialCode"><em style="color: red !important;">* </em>物料编码:</label>
          <el-input v-model="materialCode" style="width: 240px" placeholder="请输入物料编码" />
        </div>

        <div style="display: flex; flex-direction: row; gap: 10px; align-items: center !important;">
          <label for="batchNumber"><em style="color: red !important;">* </em>天然胶批次:</label>
          <el-input v-model="batchNumber" style="width: 240px" placeholder="请输入批次号" />
        </div>
      </div>
    </el-card>

    <!-- uploads block -->
    <!-- 地块信息EXCEL还没传 -->
    <el-card class="card-background">
      <template #header>
        <div class="card-header">
          <span style="font-weight: bold">文件上传</span>
        </div>
      </template>

      <!-- xlsx file upload block -->
      <div>
        <el-upload ref="xlsxFile" :auto-upload="false" class="upload-demo" drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15">
          <div class="el-icon--upload">📊</div>
          <div class="el-upload__text">拖入EXCEL文件或 <em style="color: #40a9ff;">拖入EXCEL文件或</em></div>
          <template #tip>
            <div class="el-upload__tip">支持.xlsx/.xls格式，文件大小不超过10 MB</div>
          </template>
        </el-upload>
        <span>上传地块信息EXCEL文件</span>
      </div>

      <!-- json file upload block -->
      <div>
        <el-upload ref="jsonFile" :auto-upload="false" class="upload-demo" drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15">
          <div class="el-icon--upload">📄</div>
          <div class="el-upload__text">拖入JSON文件或 <em style="color: #40a9ff;">拖入JSON文件或</em></div>
          <template #tip>
            <div class="el-upload__tip">支持.json 格式，文件大小不超过5 MB</div>
          </template>
        </el-upload>
        <span>上传地块信息JSON文件</span>
      </div>

      <!-- xlsx pdf upload block -->
      <div>
        <el-upload ref="pdfFile" :auto-upload="false" class="upload-demo" drag
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15">
          <div class="el-icon--upload">📑</div>
          <div class="el-upload__text">拖入PDF文件或 <em style="color: #40a9ff;">拖入PDF文件或</em></div>
          <template #tip>
            <div class="el-upload__tip">支持.pdf格式，文件大小不超过20 MB</div>
          </template>
        </el-upload>
        <span>上传地块信息PDF文件</span>
      </div>

    </el-card>

    <!-- action buttons -->
    <el-card class="card-background">
      <div
        style="display: flex !important; flex-direction: row !important; gap: 5px; justify-content: center !important;">
        <el-button>重置</el-button>
        <el-button type="primary">提交上传</el-button>
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