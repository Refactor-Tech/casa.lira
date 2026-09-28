<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product, ProductInput } from '@casa-lira/contracts'
import { ApiRequestError, catalogApi } from '../api'
import { formatPrice, parsePriceInput, priceToInput } from '../money'

const route = useRoute()
const router = useRouter()
const product = ref<Product | null>(null)
const title = ref('')
const price = ref('')
const description = ref('')
const imageUrl = ref('')
const fields = reactive<Record<string, string>>({})
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const feedback = ref('')
const isNew = computed(() => route.params.id === undefined)

async function load() {
  if (!isNew.value && product.value?.id === Number(route.params.id)) return
  product.value = null; error.value = ''; feedback.value = ''
  Object.keys(fields).forEach(key => delete fields[key])
  if (isNew.value) { title.value = ''; price.value = ''; description.value = ''; imageUrl.value = ''; return }
  loading.value = true
  try {
    const found = await catalogApi.getAdmin(Number(route.params.id))
    product.value = found
    title.value = found.title; price.value = priceToInput(found.priceCents)
    description.value = found.description ?? ''; imageUrl.value = found.imageUrl ?? ''
  } catch (cause) {
    error.value = cause instanceof ApiRequestError && cause.status === 404 ? 'Produto não encontrado.' : 'Não foi possível carregar o produto.'
  } finally { loading.value = false }
}
watch(() => route.params.id, load, { immediate: true })

function validate(): ProductInput | null {
  Object.keys(fields).forEach(key => delete fields[key])
  const trimmedTitle = title.value.trim()
  const cents = parsePriceInput(price.value)
  const trimmedDescription = description.value.trim()
  const trimmedUrl = imageUrl.value.trim()
  if (!trimmedTitle || trimmedTitle.length > 120) fields.title = 'Informe um título de até 120 caracteres.'
  if (cents === null) fields.priceCents = 'Informe um preço maior que zero, como 189,00.'
  if (trimmedDescription.length > 1000) fields.description = 'A descrição deve ter até 1.000 caracteres.'
  if (trimmedUrl) {
    try { const url = new URL(trimmedUrl); if (!['http:', 'https:'].includes(url.protocol)) throw new Error('invalid') }
    catch { fields.imageUrl = 'Informe uma URL http ou https válida.' }
  }
  if (Object.keys(fields).length || cents === null) return null
  return { title: trimmedTitle, priceCents: cents, description: trimmedDescription || null, imageUrl: trimmedUrl || null }
}
async function save() {
  const input = validate()
  if (!input) { error.value = 'Revise os campos indicados.'; return }
  saving.value = true; error.value = ''; feedback.value = ''
  try {
    const result = product.value ? await catalogApi.update(product.value.id, input) : await catalogApi.create(input)
    product.value = result
    feedback.value = result.status === 'publicado' ? 'Alterações salvas e visíveis no catálogo.' : 'Rascunho salvo.'
    if (isNew.value) await router.replace(`/admin/products/${result.id}`)
  } catch (cause) {
    if (cause instanceof ApiRequestError && cause.detail.fields) Object.assign(fields, cause.detail.fields)
    error.value = cause instanceof ApiRequestError ? cause.message : 'Não foi possível salvar. Tente novamente.'
  } finally { saving.value = false }
}
async function togglePublication() {
  if (!product.value) return
  saving.value = true; error.value = ''; feedback.value = ''
  try {
    product.value = product.value.status === 'publicado' ? await catalogApi.unpublish(product.value.id) : await catalogApi.publish(product.value.id)
    feedback.value = product.value.status === 'publicado' ? 'Produto publicado no catálogo.' : 'Produto retirado do catálogo.'
  } catch { error.value = 'Não foi possível mudar a publicação. Tente novamente.' }
  finally { saving.value = false }
}
</script>

<template>
  <main class="form-page">
    <RouterLink class="back-link" to="/admin">Voltar aos produtos</RouterLink>
    <div class="form-heading"><h1>{{ isNew ? 'Novo produto' : 'Editar produto' }}</h1><span v-if="product" class="status-chip" :class="product.status">{{ product.status === 'publicado' ? 'Publicado' : 'Rascunho' }}</span></div>
    <p v-if="loading" class="page-state" role="status">Carregando produto…</p>
    <div v-else-if="error === 'Produto não encontrado.'" class="page-state" role="alert">{{ error }}</div>
    <form v-else class="product-form" novalidate @submit.prevent="save">
      <p v-if="feedback" class="feedback" role="status">{{ feedback }}</p>
      <p v-if="error" class="error-banner" role="alert">{{ error }}</p>
      <div class="form-field"><label for="title">Título <span aria-hidden="true">*</span></label><input id="title" v-model="title" type="text" maxlength="120" :aria-invalid="!!fields.title" :aria-describedby="fields.title ? 'title-error' : undefined" /><small v-if="fields.title" id="title-error" class="field-error">{{ fields.title }}</small></div>
      <div class="form-field"><label for="price">Preço (R$) <span aria-hidden="true">*</span></label><input id="price" v-model="price" type="text" inputmode="decimal" placeholder="189,00" :aria-invalid="!!fields.priceCents" :aria-describedby="fields.priceCents ? 'price-error' : undefined" /><small v-if="fields.priceCents" id="price-error" class="field-error">{{ fields.priceCents }}</small><small v-else>Exemplo: {{ formatPrice(18900) }}</small></div>
      <div class="form-field"><label for="description">Descrição</label><textarea id="description" v-model="description" rows="5" maxlength="1000" :aria-invalid="!!fields.description" :aria-describedby="fields.description ? 'description-error' : undefined" /><small v-if="fields.description" id="description-error" class="field-error">{{ fields.description }}</small><small v-else>Até 1.000 caracteres.</small></div>
      <div class="form-field"><label for="image-url">URL da imagem</label><input id="image-url" v-model="imageUrl" type="url" placeholder="https://exemplo.com/imagem.jpg" :aria-invalid="!!fields.imageUrl" :aria-describedby="fields.imageUrl ? 'image-error' : undefined" /><small v-if="fields.imageUrl" id="image-error" class="field-error">{{ fields.imageUrl }}</small><small v-else>Endereço http ou https. Sem imagem, mostramos um espaço reservado.</small></div>
      <div class="form-actions"><button class="primary-button" type="submit" :disabled="saving">{{ saving ? 'Salvando…' : isNew ? 'Salvar rascunho' : 'Salvar alterações' }}</button><button v-if="product" class="secondary-button" type="button" :disabled="saving" @click="togglePublication">{{ product.status === 'publicado' ? 'Retirar de publicação' : 'Publicar produto' }}</button></div>
      <p v-if="product?.status === 'publicado'" class="form-help">Alterações salvas em produtos publicados aparecem imediatamente no catálogo.</p>
      <p v-else class="form-help">Salvar e publicar são ações separadas.</p>
    </form>
  </main>
</template>
