<script setup>
import { ref, onMounted } from 'vue'
import { useConfig } from '@/stores/config'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

const store = useConfig()
const { t } = useI18n()
const route = useRoute()
const materialCode = route.params.materialCode
const batchNumber = route.params.batchNumber

const dataTable = ref([
    {
        id: 1,
        fileName: '7a28f084-61f5-4b67-82bd-7a2489227529',
        type: 'json',
        size: 12,
        uploadDate: '2026-09-14 15:46:46'
    },
    {
        id: 2,
        fileName: 'afe11768-558b-4fda-837c-46de1cc86037',
        type: 'xlsx',
        size: 34,
        uploadDate: '2026-09-14 15:50:09'
    },
])

onMounted(async () => {
    try {
        //dataTable = await store.getPlotList(materialCode, batchNumber);
        console.log(JSON.stringify(dataTable.value) + '\n' + materialCode + '\n' + batchNumber);
    } catch (error) {
        console.error(error)
        ElMessage.error(error)
    }
})
</script>

<template>
    <div class="container">
        <el-button @click="() => { this.$router.back() }">Previous</el-button>

        <el-table v-if="dataTable.length > 0" :data="dataTable" stripe style="width: 100%">
            <el-table-column prop="id" label="Id" width="50" />
            <el-table-column prop="fileName" label="File Name" />
            <el-table-column prop="type" label="Type" width="90">
                <template #default="slot">
                    <el-tooltip></el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="size" label="Size" width="90" />
            <el-table-column prop="uploadDate" label="Upload Date" width="160" />
            <el-table-column label="Actions" width="110">
                <template #default="slot">
                    <el-button @click="() => { ElMessage.info('File downloaded.') }" size="small">Download</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-else class="content-center">
            <el-empty />
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-wrap: wrap;
    height: 100vh;
    margin: 10px;
}

.content-center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
}

.text-black {
    color: black;
}
</style>