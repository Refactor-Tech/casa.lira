# Catálogo de produtos — especificação

Status: aprovado

## Objetivo e escopo

Criar uma demonstração local de uma Loja com painel administrativo e consulta pública do catálogo. O projeto também serve para aprender a organizar um monorepo e distinguir cliente e servidor. A primeira versão permite administrar Produtos e consultar os Produtos publicados por meio de listagem e página individual. Carrinho, compra, busca, filtros e categorias ficam fora do escopo.

## Papéis

- Administrador: papel representado pelo painel administrativo; pode cadastrar, consultar, editar, publicar e excluir Produtos. O protótipo abre o painel como se a sessão já estivesse iniciada, sem autenticação real.
- Visitante: explora e compara informações básicas dos Produtos publicados, abre suas páginas individuais e não precisa de login.

## Produto

- Tem identificador estável, título e Preço. Descrição e endereço de imagem são opcionais. O título contém de 1 a 120 caracteres; a descrição, quando informada, contém no máximo 1.000 caracteres.
- Começa em rascunho. Pode ser publicado e pode voltar a rascunho; rascunhos não aparecem na consulta pública.
- Para salvar qualquer Produto, exige título não vazio e Preço maior que zero, expresso em reais com precisão de centavos. API e banco representam o Preço como número inteiro de centavos; a interface o formata em reais.
- Títulos duplicados são permitidos. O endereço público usa o identificador estável e continua válido quando o título muda.
- Salvar e publicar são ações separadas. Alterações salvas em um Produto publicado aparecem imediatamente na consulta pública, sem alterar sua posição na listagem. Ao republicar um Produto, ele passa a ser o mais recente da listagem pública.
- A exclusão é definitiva e exige confirmação; um Produto excluído deixa de aparecer na consulta pública. O endereço de um Produto excluído ou devolvido a rascunho apresenta “Produto não encontrado” e a API responde `404`.

## Experiência

- A interface usa português do Brasil e apresenta Preços como `R$ 1.234,56`.
- A primeira tela da consulta pública mostra Produtos e Preços imediatamente. O painel e a consulta pública compartilham uma identidade visual; o painel é mais denso e orientado a tarefas.
- O painel prioriza o uso em computador. Todos os fluxos do painel e da consulta pública também devem funcionar em celular.
- Título, descrição, Preço e endereço de imagem são validados no cliente e no servidor. A imagem é informada por endereço `http` ou `https`, sem envio de arquivo nesta versão. Se não carregar, a interface mostra uma imagem substituta.
- A consulta pública lista Produtos publicados dos mais recentemente publicados aos mais antigos. O painel lista todos os Produtos dos mais recentemente alterados aos mais antigos. Não há paginação nesta versão.

## Arquitetura decidida

- Monorepo gerenciado com pnpm, com duas aplicações separadas para aprender a distinção entre cliente e servidor.
- Backend em Node.js e TypeScript com Fastify; frontend em Vue.js 3 e TypeScript.
- Dados persistidos em SQLite local por meio de Drizzle ORM; mudanças de esquema controladas por migrações do Drizzle Kit.
- As aplicações se comunicam por API HTTP REST com JSON; durante o desenvolvimento, o frontend usa um proxy local para alcançar o backend. Um pacote do monorepo compartilha apenas os tipos de requisição e resposta do contrato da API.
- Não há autenticação real nesta versão do protótipo. Painel e backend aceitam conexões apenas do próprio computador (`localhost`); esta versão não é publicada na rede.
- Um comando opcional carrega cerca de 12 Produtos fictícios para casa, com imagens fictícias servidas localmente, e não os recria a cada inicialização.

## Critérios de aceite

- `pnpm install` e os comandos documentados preparam e iniciam as duas aplicações localmente; o banco persiste após reiniciar.
- O comando opcional de exemplos cria cerca de 12 Produtos fictícios sem duplicá-los quando repetido.
- A consulta pública lista apenas Produtos publicados na ordem definida, mostra detalhes e responde `404` a rascunhos, Produtos excluídos ou identificadores inexistentes.
- O painel cria, edita, publica, retira de publicação e exclui Produtos; salvar e publicar são ações separadas, exclusão pede confirmação e a interface mostra erros de validação próximos aos campos.
- O Preço é armazenado e transmitido em centavos inteiros e exibido no formato brasileiro; título, descrição e URL obedecem às regras definidas.
- A vitrine e o painel seguem o [briefing visual aprovado](design-brief.md), funcionam em computador e celular e tratam lista vazia, falha de carregamento e imagem indisponível.
- Testes automatizados cobrem cadastro, edição, visibilidade, republicação, ordenação, validação e exclusão na API; os fluxos principais da interface são verificados em desktop e celular.

## Arquitetura e direção visual

A direção visual é **Showroom doméstico** e o nome fictício aprovado é **Casa Lira**. A [arquitetura proposta](architecture.md) detalha a organização do monorepo, dados, API e rotas. O conjunto foi confirmado para decomposição em tarefas e implementação.
