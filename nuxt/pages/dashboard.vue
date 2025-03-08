<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">ダッシュボード</h1>
    <div v-if="isAuthenticated">
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">ユーザー情報</h2>
        <div class="space-y-2">
          <p><span class="font-medium">ユーザー名:</span> {{ user?.username }}</p>
          <p><span class="font-medium">メールアドレス:</span> {{ user?.email }}</p>
        </div>
      </div>
      
      <button @click="handleLogout" class="btn-secondary">
        ログアウト
      </button>
    </div>
    <div v-else>
      <p>ログインしていません。<NuxtLink to="/login" class="text-blue-600 hover:underline">ログイン</NuxtLink>してください。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
  requiresAuth: true
})

const { user, isAuthenticated, logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>