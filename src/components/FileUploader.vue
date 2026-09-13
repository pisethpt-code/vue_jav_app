<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n;

const props = defineProps({
    labelText: { type: String, default: '地块信息EXCEL' },
    formatText: { type: String, default: 'EXCEL' },
    allowedExtensions: { type: String, default: '.xlsx,.xls,.json,.pdf' },
    allowedTypesText: { type: String, default: '.xlsx / .xls / .json / .pdf' },
    maxSizeMB: { type: Number, default: 10 }
})

const emit = defineEmits(['upload-success', 'file-deleted'])

const uploadStatus = ref('idle')
const uploadProgress = ref(0)
const uploadRef = ref(null)

const fileInfo = reactive({
    name: '',
    size: '',
    extension: '',
    uploadTime: ''
})

const iconMap = {
    xlsx: '📊',
    xls: '📊',
    json: '📄',
    pdf: '📑',
    default: '📊'
}

const defaultIcon = computed(() => {
    const ext = props.formatText.toLowerCase()
    return iconMap[ext] || iconMap.default
})

const activeFileIcon = computed(() => {
    return iconMap[fileInfo.extension] || iconMap.default
})

const formatSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatCurrentTime = () => {
    const now = new Date()
    const pad = (n) => n.toString().padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

const beforeUpload = (rawFile) => {
    const ext = rawFile.name.split('.').pop().toLowerCase()
    const validExts = props.allowedExtensions.replace(/\./g, '').split(',')

    const isValidFormat = validExts.includes(ext)
    const isLtMax = rawFile.size / 1024 / 1024 < props.maxSizeMB

    if (!isValidFormat) {
        ElMessage.error(`不支持该文件格式! 仅允许: ${props.allowedTypesText}`)
        return false
    }
    if (!isLtMax) {
        ElMessage.error(`文件大小不能超过 ${props.maxSizeMB} MB!`)
        return false
    }

    fileInfo.extension = ext
    return true
}

const customUpload = (options) => {
    const { file } = options

    uploadStatus.value = 'uploading'
    uploadProgress.value = 0
    fileInfo.name = file.name
    fileInfo.size = formatSize(file.size)

    const interval = setInterval(() => {
        if (uploadProgress.value < 90) {
            uploadProgress.value += 20
        } else {
            clearInterval(interval)
            uploadProgress.value = 100
            setTimeout(() => {
                fileInfo.uploadTime = formatCurrentTime()
                uploadStatus.value = 'success'

                emit('upload-success', { file, fileInfo })

                // console.log('file: ' + JSON.stringify(file) + ', fileinfo: ' + JSON.stringify(fileInfo));
                ElMessage({
                    message: `${fileInfo.extension.toUpperCase()}文件上传成功`,
                    type: 'success'
                })
            }, 300)
        }
    }, 150)
}

// Reset state
const handleDelete = (isShowMessage = true) => {
    if (isShowMessage)
        ElMessage.warning('已删除文件')
    uploadStatus.value = 'idle'
    uploadProgress.value = 0
    fileInfo.name = ''
    fileInfo.size = ''
    fileInfo.extension = ''
    fileInfo.uploadTime = ''
    emit('file-deleted')
}

defineExpose({
    reset: (isShowMessage = false) => handleDelete(false),
})
</script>

<template>
    <div class="custom-upload-container">
        <div v-if="uploadStatus === 'idle'" class="upload-card idle-state">
            <div class="status-header text-red">
                <span class="dot red-dot"></span> {{ labelText }}{{ $t('message.fileTextLabelHasnt') }}
            </div>

            <el-upload ref="uploadRef" class="drag-uploader" drag action="#" :auto-upload="true" :show-file-list="false"
                :accept="allowedExtensions" :http-request="customUpload" :before-upload="beforeUpload">
                <div class="icon-wrapper">{{ defaultIcon }}</div>
                <div class="upload-text">
                    拖入{{ formatText }}文件 或 <span class="blue-text text-blue-underline">点击上传{{ formatText }}文件</span>
                </div>
                <div class="upload-tip">
                    支持 {{ allowedTypesText }} 格式，文件大小不超过 {{ maxSizeMB }} MB
                </div>
            </el-upload>
        </div>

        <div v-else-if="uploadStatus === 'uploading'" class="upload-card uploading-state">
            <div class="status-header text-blue">
                <span class="dot blue-dot"></span> 正在上传...
            </div>

            <div class="file-info-body">
                <div class="file-name-row">
                    <span class="file-icon">{{ activeFileIcon }}</span>
                    <span class="file-name">{{ fileInfo.name }}</span>
                </div>
                <div class="file-meta">大小: {{ fileInfo.size }}</div>

                <div class="progress-wrapper">
                    <el-progress :percentage="uploadProgress" :show-text="false" :stroke-width="8" color="#409eff" />
                    <span class="percent-text">{{ uploadProgress }}%</span>
                </div>
            </div>
        </div>

        <div v-else-if="uploadStatus === 'success'" class="upload-card success-state">
            <div class="status-header text-green">
                <span class="dot green-dot"></span> 上传成功
            </div>

            <div class="success-body">
                <div class="left-info">
                    <div class="file-name-row">
                        <span class="file-icon">{{ activeFileIcon }}</span>
                        <span class="file-name">{{ fileInfo.name }}</span>
                    </div>
                    <div class="file-meta">
                        大小: {{ fileInfo.size }} &nbsp;&nbsp;&nbsp;&nbsp; 上传时间: {{ fileInfo.uploadTime }}
                    </div>
                </div>

                <div class="right-actions">
                    <el-upload action="#" :show-file-list="false" :accept="allowedExtensions"
                        :http-request="customUpload" :before-upload="beforeUpload" style="display: inline-block;">
                        <el-button size="small">重新上传</el-button>
                    </el-upload>
                    <el-button size="small" @click="handleDelete" type="danger" plain>删除</el-button>
                </div>
            </div>
        </div>

        <div class="bottom-label">上传{{ labelText }}文件</div>
    </div>
</template>

<style scoped>
.custom-upload-container {
    width: 100%;
    /* max-width: 650px; */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.upload-card {
    border-radius: 4px;
    padding: 16px 20px;
    background-color: #f4f8fe;
    box-sizing: border-box;
}

.idle-state,
.uploading-state {
    border: 1.5px dashed #409eff;
}

.success-state {
    border: 1px solid #b7eb8f;
    background-color: #f6ffed;
}

.status-header {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
}

.red-dot {
    background-color: #ff4d4f;
}

.blue-dot {
    background-color: #1890ff;
}

.green-dot {
    background-color: #52c41a;
}

.text-red {
    color: #ff4d4f;
}

.text-blue {
    color: #1890ff;
}

.text-blue-underline:hover {
    text-decoration: underline;
}

.text-green {
    color: #52c41a;
}

:deep(.el-upload-dragger) {
    background: transparent !important;
    border: none !important;
    padding: 10px 0 !important;
}

.icon-wrapper {
    font-size: 32px;
    margin-bottom: 8px;
}

.upload-text {
    font-size: 14px;
    color: #595959;
}

.blue-text {
    color: #1890ff;
    cursor: pointer;
}

.upload-tip {
    font-size: 12px;
    color: #8c8c8c;
    margin-top: 6px;
}

.file-name-row {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #262626;
    font-weight: 500;
}

.file-icon {
    margin-right: 8px;
    font-size: 18px;
}

.file-meta {
    font-size: 12px;
    color: #8c8c8c;
    margin: 6px 0 10px 26px;
}

.progress-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
}

.progress-wrapper :deep(.el-progress) {
    flex: 1;
}

.percent-text {
    font-size: 12px;
    color: #595959;
    width: 35px;
}

.success-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.right-actions {
    display: flex;
    gap: 8px;
    align-items: center;
}

.bottom-label {
    margin-top: 8px;
    font-size: 13px;
    color: #262626;
}
</style>