<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/">Casa Lira</RouterLink>
      <nav aria-label="Navegação principal">
        <span class="demo-label">DEMONSTRAÇÃO</span>
        <RouterLink to="/">Catálogo</RouterLink>
        <RouterLink to="/admin">Painel</RouterLink>
      </nav>
    </header>
    <RouterView />
  </div>
</template>
