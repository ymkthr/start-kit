<template>
  <form @submit.prevent="handleSubmit">
    <MoleculesFormGroup>
      <AtomsBaseInput
        id="username"
        v-model="form.username"
        label="ユーザー名"
        :error="errors.username"
        required
      />
      
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
      
      <AtomsBaseInput
        id="passwordConfirm"
        v-model="form.passwordConfirm"
        label="パスワード（確認）"
        type="password"
        :error="errors.passwordConfirm"
        required
      />
      
      <div class="pt-2">
        <AtomsBaseButton type="submit" variant="primary" class="w-full" :disabled="isSubmitting">
          {{ isSubmitting ? '登録中...' : '登録する' }}
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

const { register } = useAuth()
const isSubmitting = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  general: ''
})

const validateForm = (): boolean => {
  let isValid = true
  
  // ユーザー名のバリデーション
  if (form.username.length < 3) {
    errors.username = 'ユーザー名は3文字以上で入力してください'
    isValid = false
  } else {
    errors.username = ''
  }
  
  // メールアドレスのバリデーション
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = '有効なメールアドレスを入力してください'
    isValid = false
  } else {
    errors.email = ''
  }
  
  // パスワードのバリデーション
  if (form.password.length < 8) {
    errors.password = 'パスワードは8文字以上で入力してください'
    isValid = false
  } else {
    errors.password = ''
  }
  
  // パスワード確認のバリデーション
  if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = 'パスワードが一致しません'
    isValid = false
  } else {
    errors.passwordConfirm = ''
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
    const result = await register(form.username, form.email, form.password)
    
    if (result.success) {
      emit('success')
    } else {
      errors.general = result.error || '登録に失敗しました'
      emit('error', errors.general)
    }
  } catch (error) {
    console.error('登録エラー:', error)
    errors.general = '登録処理中にエラーが発生しました'
    emit('error', errors.general)
  } finally {
    isSubmitting.value = false
  }
}
</script>