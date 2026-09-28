# Briefing visual — catálogo de produtos

Status: aprovado.

## Trabalho e público

- **Consulta pública (Operate):** o Visitante explora cerca de 12 Produtos fictícios para casa, compara foto, título e Preço e abre a página individual. Os Produtos e Preços aparecem na primeira tela.
- **Painel (Operate):** o Administrador mantém Produtos, distingue rascunhos de publicados e executa cadastro, edição, publicação, retirada de publicação e exclusão com segurança visual. O painel representa uma sessão já iniciada, sem fluxo de login.

## Direção selecionada

**Showroom doméstico**, conforme a [composição escolhida](../../.impeccable/mocks/decision/model-pick.png). O mundo visual parte de um mostruário de objetos para casa: superfícies minerais claras, verde profundo, madeira escura e um acento terroso contido. A fotografia dos Produtos conduz a leitura; etiquetas curtas e precisas deixam nome e Preço fáceis de comparar. O nome fictício aprovado da Loja é **Casa Lira**.

A primeira tela da vitrine deve mostrar a própria coleção, sem introdução extensa. A [composição final aprovada](../../.impeccable/mocks/comp-b.png) organiza quatro Produtos por linha em duas prateleiras contínuas, com nome e Preço legíveis sob cada objeto. Em celular, a estrutura reduz colunas preservando essa leitura. O painel herda as cores, a tipografia e o caráter material da vitrine, mas usa densidade maior, controles convencionais e estados claros. A identidade deve continuar coerente nas páginas de Produto, na lista administrativa e nos formulários.

## Superfícies e interações

- **Lista pública:** fotos, títulos e Preços legíveis; entrada para a página individual; ordem de publicação; indicação discreta de demonstração.
- **Detalhe público:** foto em destaque, título, Preço, descrição quando houver e retorno à lista. Produto em rascunho, excluído ou inexistente mostra “Produto não encontrado”.
- **Lista administrativa:** todos os Produtos, com estado, identificação, Preço, última alteração e ações fáceis de encontrar; ordem da última alteração.
- **Formulário administrativo:** título, Preço, descrição e URL da imagem; salvar rascunho e controlar publicação como ações explícitas. Validar antes de salvar, mostrar erros ao lado dos campos e confirmar exclusão definitiva.
- **Estados:** início sem Produtos, lista pública vazia, carregamento, erro de API, confirmação de salvar/publicar/retirar/excluir e imagem ausente ou indisponível. A cor reforça o estado, mas texto e forma também o identificam.

## Escala e adaptação

Os exemplos cobrem cerca de 12 Produtos e incluem títulos de comprimentos diferentes. O design também deve funcionar com nenhum Produto e com descrições ou imagens ausentes. Em celular, a coleção reduz colunas sem reduzir a legibilidade de títulos e Preços; a lista administrativa troca densidade por uma leitura e ações acessíveis. Desktop é prioritário para o painel, mas todos os fluxos são utilizáveis em celular.

## Limites

Conteúdo e marca são fictícios e devem ser identificados como demonstração. Não criar alegações sobre origem, materiais, localização, história, avaliações ou descontos sem dados correspondentes. Não incluir carrinho, compra, busca, filtros, categorias, login ou envio de imagens. A interface usa português do Brasil e formato monetário brasileiro. Movimento serve apenas para comunicar mudança de estado e respeita a preferência por movimento reduzido.

## Para a implementação

A composição final aprovada é `.impeccable/mocks/comp-b.png`; a implementação deverá ser conferida em desktop e celular. Componentes e estados do painel devem ser derivados da mesma identidade, priorizando clareza da tarefa.
