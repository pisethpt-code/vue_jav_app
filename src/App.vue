<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { switchLang } from '@/i18n/index.js';

const { locale } = useI18n();
const languese = [
  {
    value: 'cn',
    label: '中文',
  },
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'kh',
    label: 'ភាសាខ្មែរ',
  },
]

onMounted(async () => {
  const lang = localStorage.getItem('user-locale') || 'cn';
  await handleSwitchLang(lang);
})

const handleSwitchLang = async (lang) => {
  localStorage.setItem('user-locale', lang);
  await switchLang(lang)
}
</script>

<template>
  <div style="display: flex; justify-content: end; margin: 15px;">
    <el-select v-model="locale" placeholder="Languese" style="width: 100px" @change="handleSwitchLang($event)">
      <el-option v-for="item in languese" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
  <RouterView class="container" />
</template>

<style scoped>
.container {
  display: flex;
  margin: 10px;
}
</style>