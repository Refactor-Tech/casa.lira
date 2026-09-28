<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ url: string | null; title: string }>()
const failed = ref(false)
watch(() => props.url, () => { failed.value = false })
</script>

<template>
  <img v-if="url && !failed" class="product-photo" :src="url" :alt="title" @error="failed = true" />
  <div v-else class="photo-fallback" role="img" :aria-label="`Imagem indisponível para ${title}`">
    <span>Casa Lira</span>
    <small>Imagem indisponível</small>
  </div>
</template>
