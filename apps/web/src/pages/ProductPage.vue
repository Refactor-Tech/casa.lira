<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '@casa-lira/contracts'
import { ApiRequestError, catalogApi } from '../api'
import { formatPrice } from '../money'
import ProductImage from '../components/ProductImage.vue'

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref('')
async function load() {
  loading.value = true; error.value = ''; product.value = null
  try { product.value = await catalogApi.getPublic(Number(route.params.id)) }
  catch (cause) { error.value = cause instanceof ApiRequestError && cause.status === 404 ? 'Produto não encontrado.' : 'Não foi possível carregar o produto.' }
  finally { loading.value = false }
}
onMounted(load)
watch(() => route.params.id, load)
</script>

<template>
  <main class="detail-page">
    <RouterLink class="back-link" to="/">Voltar ao catálogo</RouterLink>
    <p v-if="loading" class="page-state" role="status">Carregando produto…</p>
    <div v-else-if="error" class="page-state" role="alert"><h1>{{ error }}</h1><button v-if="error !== 'Produto não encontrado.'" class="text-button" type="button" @click="load">Tentar novamente</button></div>
    <article v-else-if="product" class="detail-layout">
      <div class="detail-image"><ProductImage :url="product.imageUrl" :title="product.title" /></div>
      <div class="detail-info">
        <h1>{{ product.title }}</h1>
        <p class="detail-price">{{ formatPrice(product.priceCents) }}</p>
        <p v-if="product.description" class="detail-description">{{ product.description }}</p>
        <p class="demo-note">Produto fictício para demonstração.</p>
      </div>
    </article>
  </main>
</template>
