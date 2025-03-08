<template>
  <TemplatesAuthTemplate title="会員登録">
    <OrganismsRegisterForm @success="handleRegisterSuccess" @error="handleRegisterError" />
    <template #footer>
      <p>
        すでにアカウントをお持ちの方は
        <NuxtLink to="/login" class="text-blue-600 hover:underline">こちらからログイン</NuxtLink>
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

const handleRegisterSuccess = () => {
  // 登録成功後、ログインページへリダイレクト
  setTimeout(() => {
    router.push('/login')
  }, 1000)
}

const handleRegisterError = (error: string) => {
  console.error('登録エラー:', error)
}
</script>