# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Monorepo pnpm com frontend Vue.js 3 e TypeScript e backend Node.js, TypeScript e Fastify. O cliente consome uma API HTTP REST com JSON; um pacote do monorepo compartilha apenas o contrato da API. SQLite local com Drizzle ORM e migrações do Drizzle Kit.

## Users

O Administrador usa o painel para manter Produtos, controlar sua publicação e conferir o catálogo. O Visitante explora os Produtos publicados, compara informações básicas e abre a página individual, sem fluxo de compra.

## Product Purpose

Protótipo local de catálogo de produtos que permite administrar e consultar Produtos. O projeto também serve para aprender a organizar um monorepo e a distinguir responsabilidades do cliente e do servidor.

## Operating Context

A demonstração roda no próprio computador e não é publicada na rede. O painel aparece como se o Administrador já estivesse conectado, sem autenticação real. Um comando opcional carrega Produtos fictícios para casa como dados de exemplo.

## Capabilities and Constraints

O Administrador cadastra, consulta, edita, publica, devolve a rascunho e exclui Produtos. Todo Produto salvo tem título e Preço positivo em reais; descrição e imagem por URL são opcionais. Apenas Produtos publicados aparecem na consulta pública, que tem listagem e página individual. Carrinho, compra, busca, filtros, categorias e envio de arquivos estão fora desta versão. A interface usa português do Brasil e funciona em computador e celular.

## Brand Commitments

Não existem nome, logo, fotos ou identidade visual a preservar. A marca fictícia aprovada para a demonstração chama-se Casa Lira; seu caráter fictício deve ficar claro.

## Evidence on Hand

O repositório contém `CONTEXT.md` e `.scratch/catalogo-produtos/spec.md` com o domínio e a especificação em andamento. Ainda não há implementação de interface, fotos reais de Produtos ou materiais de marca.

## Product Principles

- Tornar a fronteira entre cliente e servidor explícita para fins de aprendizado.
- Permitir que o Visitante encontre e compare Produtos publicados com clareza.
- Manter as operações do Administrador diretas e compreensíveis.
- Tratar conteúdo fictício como demonstração, sem alegações comerciais inventadas.
