<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">ようこそ Nuxt Auth App へ</h1>
    <p class="mb-4">このアプリケーションでは、会員登録とログイン機能を提供しています。</p>
    <div class="flex space-x-4 mt-8">
      <NuxtLink to="/register" class="btn-primary">会員登録</NuxtLink>
      <NuxtLink to="/login" class="btn-secondary">ログイン</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>