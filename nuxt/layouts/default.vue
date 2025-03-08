<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-800">Nuxt Auth App</h1>
        <nav>
          <ul class="flex space-x-4">
            <li>
              <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">ホーム</NuxtLink>
            </li>
            <li v-if="!isAuthenticated">
              <NuxtLink to="/register" class="text-gray-600 hover:text-gray-900">会員登録</NuxtLink>
            </li>
            <li v-if="!isAuthenticated">
              <NuxtLink to="/login" class="text-gray-600 hover:text-gray-900">ログイン</NuxtLink>
            </li>
            <li v-if="isAuthenticated">
              <NuxtLink to="/dashboard" class="text-gray-600 hover:text-gray-900">ダッシュボード</NuxtLink>
            </li>
            <li v-if="isAuthenticated">
              <span @click="logout" class="text-gray-600 hover:text-gray-900">ログアウト</span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <footer class="bg-white shadow-inner mt-auto">
      <div class="container mx-auto px-4 py-4 text-center text-gray-500">
        &copy; {{ new Date().getFullYear() }} Nuxt Auth App
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, logout } = useAuth()
</script>