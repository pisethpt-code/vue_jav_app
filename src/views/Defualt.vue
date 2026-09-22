<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = ref(route.query.id);
const name = ref(route.query.name);


onMounted(() => {
    console.log('id: ' + id.value);

})

const refresh = () => {
    window.location.reload();
}
</script>
<template>
    <div class="container">
        <span class="default-text">Id: {{ id }}</span>
        <span class="default-text">Name: {{ name }}</span>
        <el-button @click="refresh" type="danger" size="small" paint="false">Refresh</el-button>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: start;
}

.default-text {
    color: black;
}
</style>