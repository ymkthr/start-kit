<template>
  <form @submit.prevent="handleSubmit">
    <MoleculesFormGroup>
      <AtomsBaseInput
        id="email"
        v-model="form.email"
        label="メールアドレス"
        type="email"
        :error="errors.email"
        required
      />
      
      <AtomsBaseInput
        id="password"
        v-model="form.password"
        label="パスワード"
        type="password"
        :error="errors.password"
        required
      />
      
      <div class="flex items-center">
        <input
          id="remember"
          v-model="form.remember"
          type="checkbox"
          class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label for="remember" class="ml-2 block text-sm text-gray-700">ログイン状態を保持する</label>
      </div>
      
      <div class="pt-2">
        <AtomsBaseButton type="submit" variant="primary" class="w-full" :disabled="isSubmitting">
          {{ isSubmitting ? 'ログイン中...' : 'ログイン' }}
        </AtomsBaseButton>
      </div>
      
      <div v-if="errors.general" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ errors.general }}
      </div>
    </MoleculesFormGroup>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '~/composables/useAuth'

const emit = defineEmits(['success', 'error'])

const { login } = useAuth()
const isSubmitting = ref(false)

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: '',
  general: ''
})

const validateForm = (): boolean => {
  let isValid = true
  
  // メールアドレスのバリデーション
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = '有効なメールアドレスを入力してください'
    isValid = false
  } else {
    errors.email = ''
  }
  
  // パスワードのバリデーション
  if (form.password.length < 1) {
    errors.password = 'パスワードを入力してください'
    isValid = false
  } else {
    errors.password = ''
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  errors.general = ''
  
  try {
    const result = await login(form.email, form.password)
    
    if (result.success) {
      emit('success')
    } else {
      errors.general = result.error || 'ログインに失敗しました'
      emit('error', errors.general)
    }
  } catch (error) {
    console.error('ログインエラー:', error)
    errors.general = 'ログイン処理中にエラーが発生しました'
    emit('error', errors.general)
  } finally {
    isSubmitting.value = false
  }
}
</script>