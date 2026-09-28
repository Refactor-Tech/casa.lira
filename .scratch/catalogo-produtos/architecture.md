# Arquitetura proposta — Casa Lira

Status: aprovada e implementada.

## Fronteiras

```text
pnpm workspace
├── apps/web             Vue 3 + TypeScript + Vite + Vue Router
├── apps/api             Node.js + TypeScript + Fastify + Drizzle + SQLite
└── packages/contracts   Tipos das requisições e respostas da API
```

O navegador carrega o cliente em `127.0.0.1:5173`. O cliente chama caminhos relativos `/api/...`; o servidor de desenvolvimento do Vite encaminha essas requisições para o backend em `127.0.0.1:3000`. O backend é o único dono do banco e da validação de dados recebidos. O frontend não importa código de `apps/api`; ambos dependem apenas de `packages/contracts`. As duas aplicações aceitam conexões somente em `127.0.0.1`.

## Modelo persistido

Uma tabela `products` contém: `id` inteiro estável, `title`, `price_cents` inteiro positivo, `description` opcional, `image_url` opcional, `status` (`rascunho` ou `publicado`), `created_at`, `updated_at` e `published_at` opcional. A criação começa em rascunho. Publicar grava a data de publicação; republicar a atualiza; editar sem mudar o estado preserva essa data. Retirar de publicação torna `published_at` nulo. Excluir remove o registro.

O SQLite fica em arquivo local ignorado pelo Git. Migrações versionadas ficam junto do backend. O comando de exemplos insere cerca de 12 Produtos fictícios com fotos locais quando o banco está vazio; repetir o comando não duplica dados. As fotos de demonstração são servidas localmente, para a aplicação funcionar sem depender de um serviço externo de imagens. O formulário continua aceitando URLs `http` ou `https`.

## API HTTP JSON

| Método e caminho | Uso |
| --- | --- |
| `GET /api/products` | Lista Produtos publicados, por `published_at` decrescente. |
| `GET /api/products/:id` | Consulta Produto publicado; `404` nos demais casos. |
| `GET /api/admin/products` | Lista todos os Produtos, por `updated_at` decrescente. |
| `GET /api/admin/products/:id` | Consulta Produto para o painel. |
| `POST /api/admin/products` | Cria Produto em rascunho. |
| `PUT /api/admin/products/:id` | Salva título, Preço, descrição e URL da imagem, sem mudar o estado. |
| `POST /api/admin/products/:id/publish` | Publica ou republica. |
| `POST /api/admin/products/:id/unpublish` | Devolve a rascunho. |
| `DELETE /api/admin/products/:id` | Exclui definitivamente. |

O contrato compartilhado usa `priceCents` inteiro e estados `rascunho`/`publicado`. A API valida título de 1 a 120 caracteres após remover espaços externos, descrição de até 1.000 caracteres, Preço inteiro maior que zero e URL opcional `http` ou `https`. Erros de validação retornam `400` com código, mensagem e erros por campo. Produto inexistente retorna `404`. Rotas administrativas não têm autenticação nesta demonstração local; a interface mostra o painel diretamente.

## Cliente

Rotas implementadas: `/` para lista pública, `/products/:id` para detalhe, `/admin` para lista administrativa, `/admin/products/new` para cadastro e `/admin/products/:id` para edição. A navegação usa Vue Router. Salvar e publicar são ações separadas. A interface trata lista vazia, carregamento, erro de API, erro de campo, imagem indisponível e confirmação de exclusão. O cliente formata centavos como reais e não usa o texto formatado como valor persistido.

O [briefing visual aprovado](design-brief.md) orienta a vitrine e o painel. O fluxo Impeccable escolhido é comp-first; a composição selecionada entra como primeira referência antes da implementação visual.

## Desenvolvimento e verificação

O README documenta instalação, migração, carga opcional de exemplos, início das duas aplicações e execução de testes. Um comando na raiz inicia frontend e backend juntos. Testes de integração da API usam um banco temporário para verificar operações, validações, ordenação, visibilidade e exclusão. A interface é verificada nos fluxos principais em desktop e celular, incluindo estados vazios e erros.

## Referências técnicas consultadas

- [pnpm workspaces](https://pnpm.io/workspaces)
- [Vue 3, TypeScript e Vite](https://vuejs.org/guide/quick-start)
- [Vue Router](https://router.vuejs.org/guide/)
- [Vite server proxy](https://vite.dev/config/server-options#server-proxy)
- [Fastify com TypeScript](https://github.com/fastify/fastify/blob/main/docs/Reference/TypeScript.md)
- [Drizzle SQLite migrations](https://orm.drizzle.team/docs/migrations)
