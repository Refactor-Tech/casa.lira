# Casa Lira

Protótipo local de catálogo de Produtos para aprender a organizar um monorepo pnpm e separar cliente e servidor. A marca, os Produtos e as fotos de exemplo são fictícios.

## Requisitos

- Node.js 24
- pnpm 10

## Início rápido

```sh
pnpm install
pnpm seed
pnpm dev
```

A vitrine e o painel ficam em `http://127.0.0.1:5173/` e `http://127.0.0.1:5173/admin`. A API usa `http://127.0.0.1:3000` e o Vite encaminha as chamadas `/api` durante o desenvolvimento. Os dois servidores aceitam conexões apenas do próprio computador. O painel não tem autenticação neste protótipo.

`pnpm dev` aplica as migrações antes de iniciar as aplicações. `pnpm seed` é opcional: cria dez Produtos publicados com fotos locais e dois rascunhos somente quando o catálogo está vazio. Repetir o comando não duplica dados. O banco fica em `apps/api/catalog.sqlite` e persiste entre execuções.

## Comandos

| Comando | Função |
| --- | --- |
| `pnpm dev` | Inicia cliente e API localmente. |
| `pnpm db:generate` | Gera uma migração após alterar o esquema Drizzle. |
| `pnpm db:migrate` | Aplica migrações pendentes. |
| `pnpm seed` | Carrega dados fictícios quando o banco está vazio. |
| `pnpm test` | Executa testes de integração da API. |
| `pnpm test:ui` | Com `pnpm dev` ativo e Chrome instalado, exercita os fluxos de catálogo e painel em desktop e celular. |
| `pnpm build` | Compila contrato, API e interface. |

## Organização

- `apps/web`: interface Vue 3, incluindo as fotos fictícias locais em `public/assets/plates/` e `public/demo/`.
- `apps/api`: API Fastify e banco SQLite com Drizzle.
- `packages/contracts`: tipos compartilhados das requisições e respostas.
- `.scratch/catalogo-produtos/`: especificação, arquitetura, briefing visual e tarefas locais.

O formulário administrativo aceita endereços de imagem `http` ou `https`. Imagens indisponíveis recebem uma apresentação substituta na interface. O protótipo não inclui compra, carrinho ou publicação na rede.
