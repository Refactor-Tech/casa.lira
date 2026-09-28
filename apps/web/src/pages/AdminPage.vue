<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Product } from '@casa-lira/contracts'
import { catalogApi } from '../api'
import { formatPrice } from '../money'
import ProductImage from '../components/ProductImage.vue'

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')
const feedback = ref('')
const busyId = ref<number | null>(null)
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

async function load() {
  loading.value = true; error.value = ''
  try { products.value = await catalogApi.listAdmin() }
  catch { error.value = 'Não foi possível carregar os produtos.' }
  finally { loading.value = false }
}
async function toggle(product: Product) {
  busyId.value = product.id; feedback.value = ''; error.value = ''
  try {
    const updated = product.status === 'publicado' ? await catalogApi.unpublish(product.id) : await catalogApi.publish(product.id)
    feedback.value = updated.status === 'publicado' ? `“${updated.title}” publicado.` : `“${updated.title}” retirado do catálogo.`
    await load()
  } catch { error.value = 'Não foi possível mudar a publicação. Tente novamente.' }
  finally { busyId.value = null }
}
async function remove(product: Product) {
  if (!window.confirm(`Excluir “${product.title}” definitivamente? Esta ação não pode ser desfeita.`)) return
  busyId.value = product.id; feedback.value = ''; error.value = ''
  try {
    await catalogApi.remove(product.id)
    feedback.value = `“${product.title}” excluído.`
    await load()
  } catch { error.value = 'Não foi possível excluir o produto. Tente novamente.' }
  finally { busyId.value = null }
}
onMounted(load)
</script>

<template>
  <main class="admin-page">
    <div class="admin-heading">
      <div><h1>Produtos</h1><p>Organize o catálogo da Casa Lira.</p></div>
      <RouterLink class="primary-button" to="/admin/products/new">Novo produto</RouterLink>
    </div>
    <p v-if="feedback" class="feedback" role="status">{{ feedback }}</p>
    <div v-if="error" class="error-banner" role="alert">{{ error }} <button type="button" class="text-button" @click="load">Tentar novamente</button></div>
    <p v-if="loading" class="page-state" role="status">Carregando produtos…</p>
    <div v-else-if="!products.length && !error" class="page-state"><h2>Seu catálogo está vazio</h2><p>Cadastre o primeiro produto para começar.</p><RouterLink class="primary-button" to="/admin/products/new">Criar produto</RouterLink></div>
    <div v-else-if="products.length" class="admin-list">
      <div class="admin-list-head" aria-hidden="true"><span>Produto</span><span>Estado</span><span>Preço</span><span>Atualizado</span><span>Ações</span></div>
      <article v-for="product in products" :key="product.id" class="admin-row">
        <div class="admin-product"><div class="admin-thumb"><ProductImage :url="product.imageUrl" :title="product.title" /></div><div><strong>{{ product.title }}</strong><small>ID {{ product.id }}</small></div></div>
        <span class="status-chip" :class="product.status">{{ product.status === 'publicado' ? 'Publicado' : 'Rascunho' }}</span>
        <span class="admin-price">{{ formatPrice(product.priceCents) }}</span>
        <time :datetime="product.updatedAt">{{ dateFormatter.format(new Date(product.updatedAt)) }}</time>
        <div class="admin-actions"><RouterLink :to="`/admin/products/${product.id}`">Editar</RouterLink><button type="button" :disabled="busyId === product.id" @click="toggle(product)">{{ product.status === 'publicado' ? 'Retirar' : 'Publicar' }}</button><button type="button" class="danger-action" :disabled="busyId === product.id" @click="remove(product)">Excluir</button></div>
      </article>
    </div>
    <p class="demo-note admin-demo">Painel de demonstração local. Sessão simulada, sem autenticação.</p>
  </main>
</template>
