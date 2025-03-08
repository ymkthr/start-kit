<template>
  <TemplatesAuthTemplate title="ログイン">
    <OrganismsLoginForm @success="handleLoginSuccess" @error="handleLoginError" />
    <template #footer>
      <p>
        アカウントをお持ちでない方は
        <NuxtLink to="/register" class="text-blue-600 hover:underline">こちらから登録</NuxtLink>
      </p>
    </template>
  </TemplatesAuthTemplate>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const router = useRouter()

const handleLoginSuccess = () => {
  // ログイン成功後、ダッシュボードページへリダイレクト
  setTimeout(() => {
    router.push('/dashboard')
  }, 1000)
}

const handleLoginError = (error: string) => {
  console.error('ログインエラー:', error)
}
</script>