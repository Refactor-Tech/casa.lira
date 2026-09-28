<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Product } from '@casa-lira/contracts'
import { catalogApi } from '../api'
import { formatPrice } from '../money'
import ProductImage from '../components/ProductImage.vue'

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try { products.value = await catalogApi.listPublic() }
  catch { error.value = 'Não foi possível carregar o catálogo. Tente novamente.' }
  finally { loading.value = false }
}
onMounted(load)
</script>

<template>
  <main class="catalog-page">
    <div v-if="loading" class="page-state" role="status">Carregando produtos…</div>
    <div v-else-if="error" class="page-state" role="alert">
      <p>{{ error }}</p><button type="button" class="text-button" @click="load">Tentar novamente</button>
    </div>
    <div v-else-if="!products.length" class="page-state">
      <h1>Nenhum produto publicado</h1><p>Volte em outro momento para explorar a coleção.</p>
    </div>
    <template v-else>
      <h1 class="visually-hidden">Catálogo Casa Lira</h1>
      <div class="catalog-grid">
        <RouterLink v-for="product in products" :key="product.id" class="catalog-item" :to="`/products/${product.id}`" :aria-label="`${product.title}, ${formatPrice(product.priceCents)}. Ver produto`">
          <div class="catalog-image"><ProductImage :url="product.imageUrl" :title="product.title" /></div>
          <div class="catalog-caption">
            <span class="catalog-name">{{ product.title }}</span>
            <span class="catalog-price">{{ formatPrice(product.priceCents) }}</span>
          </div>
        </RouterLink>
      </div>
    </template>
  </main>
</template>
