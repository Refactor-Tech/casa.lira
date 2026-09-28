---
name: Casa Lira
description: Showroom doméstico para um catálogo fictício de objetos para casa.
colors:
  forest: "#254734"
  forest-hover: "#183c29"
  forest-link: "#17452d"
  warm-ink: "#251d14"
  mineral: "#ded6c8"
  header-linen: "#e8ded0"
  shelf-mat: "#b9aa94"
  form-paper: "#e7dfd0"
  input-paper: "#f7f1e8"
  ivory: "#fffaf0"
  soft-rule: "#b4a998"
  clay-error: "#8c3023"
typography:
  display:
    fontFamily: "Casa Lira Serif, Georgia, serif"
    fontSize: "clamp(40px, 5vw, 70px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-.025em"
  headline:
    fontFamily: "Casa Lira Serif, Georgia, serif"
    fontSize: "clamp(40px, 5vw, 76px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-.025em"
  title:
    fontFamily: "Casa Lira Serif, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Casa Lira Serif, Georgia, serif"
    fontSize: "20px"
    lineHeight: 1.55
  label:
    fontFamily: "Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.2
rounded:
  square: "0"
  status-pill: "100px"
spacing:
  field-gap: "8px"
  row-padding: "14px"
  control-block: "12px"
  control-inline: "22px"
  page-gutter: "4%"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.ivory}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "12px 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.forest-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.forest}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "12px 22px"
    height: "48px"
  input:
    backgroundColor: "{colors.input-paper}"
    textColor: "{colors.warm-ink}"
    rounded: "{rounded.square}"
    padding: "12px 14px"
    height: "48px"
  status-published:
    backgroundColor: "#cbddc7"
    textColor: "#17422b"
    rounded: "{rounded.status-pill}"
    padding: "7px 10px"
  status-draft:
    backgroundColor: "#d8cec0"
    textColor: "#54402d"
    rounded: "{rounded.status-pill}"
    padding: "7px 10px"
---

# Design System: Casa Lira

## Overview

**Creative North Star: "Showroom doméstico"**

Casa Lira apresenta objetos fictícios como uma coleção em prateleiras contínuas. Superfícies minerais quentes, faixas de madeira fotografada e nichos verticais dão presença aos objetos. O texto fica próximo ao produto e preserva a comparação de nome e preço.

O painel administrativo conserva a mesma temperatura de cor e tipografia, mas troca a composição de prateleiras por linhas e campos diretos. O caráter de demonstração permanece explícito na navegação e nas descrições dos produtos.

**Key Characteristics:**
- Matéria quente e discreta, com verde profundo reservado a ações e links.
- Serifada regular nos títulos e na leitura; Arial nos controles e metadados pequenos.
- Produtos grandes em uma grade contínua, sem caixas isoladas.
- Profundidade fotográfica nas prateleiras; interfaces planas no painel.

## Colors

A paleta combina pedra, linho e madeira claros com tinta marrom escura e verde florestal.

### Primary
- **Verde florestal** (`forest`): preenchimento de ações principais e contorno dos botões; escurece em hover (`forest-hover`).
- **Verde de link** (`forest-link`): ações textuais sublinhadas no painel e estados de recuperação.

### Neutral
- **Tinta quente** (`warm-ink`): texto principal no catálogo e no painel.
- **Pedra mineral** (`mineral`): base da aplicação e faixas de legenda da coleção.
- **Linho de cabeçalho** (`header-linen`): barra de marca.
- **Esteira da prateleira** (`shelf-mat`): fundo das imagens, visível enquanto carregam ou em áreas descobertas.
- **Papel de formulário** (`form-paper`) e **papel de campo** (`input-paper`): plano administrativo e superfícies editáveis.
- **Marfim** (`ivory`): texto das ações preenchidas e seleção.
- **Regra suave** (`soft-rule`): divisórias das linhas administrativas.
- **Argila de erro** (`clay-error`): texto de validação de campo.

### Named Rules

**The Material Ground Rule.** A base mineral e os planos de linho sustentam as imagens; o verde identifica ação, não preenche grandes superfícies do catálogo.

## Typography

**Display Font:** Casa Lira Serif (arquivo Noto Serif Display Regular, com Georgia e serif como fallback).
**Body Font:** Casa Lira Serif, com Georgia e serif como fallback.
**Label/Mono Font:** Arial, sans-serif para botões, notas, estado e apoio de formulário.

**Character:** A serifada regular traz um tom doméstico e editorial. A fonte sem serifa torna operações administrativas e informação auxiliar mais rápidas de ler.

### Hierarchy
- **Display** (400, `clamp(40px, 5vw, 70px)`, 1): títulos do painel e formulário.
- **Headline** (400, `clamp(40px, 5vw, 76px)`, 1.02): nome na página de produto.
- **Title** (400, 17px, 1.2): nomes na coleção e nas linhas administrativas.
- **Body** (20px, 1.55): descrição de produto, limitada a 60ch na página de detalhe.
- **Label** (Arial 600, 14px, 1.2): texto de botões; cabeçalhos de lista usam 12px, caixa alta e espaçamento .08em.

### Named Rules

**The Quiet Serif Rule.** Hierarquia vem de escala e espaço; títulos usam o peso regular da fonte carregada.

## Layout

A coleção ocupa toda a largura em quatro nichos por linha no desktop e dois até 760px. Cada nicho mantém a imagem dominante e nome e preço juntos na faixa inferior; o cartão inteiro leva ao detalhe. Texturas de borda de prateleira atravessam a linha por posições coordenadas, preservando a continuidade visual.

As páginas de detalhe e administração usam margem lateral de 4%. O detalhe combina imagem e informação em duas colunas, depois empilha em até 760px. O painel limita a área a 1500px, enquanto o formulário limita a 950px. A lista administrativa passa de cinco colunas para uma composição compacta em 1050px; em celular, as ações recebem alvos de pelo menos 44px de altura.

## Elevation & Depth

Não há sombras CSS no sistema. A profundidade pública vem das fotografias, dos recortes dos nichos e dos arquivos de borda de prateleira. A administração usa cor de plano e divisórias finas para separar linhas e formulário.

### Named Rules

**The Photographic Depth Rule.** A prateleira pode ter profundidade dentro das imagens e das bordas ilustradas; controles e linhas de trabalho permanecem planos.

## Shapes

Botões, campos, imagens e painéis usam cantos retos. O recorte das imagens é retangular e corta o excedente. A exceção recorrente é a cápsula de estado, com raio de 100px para distinguir publicação e rascunho das ações retangulares.

## Components

### Buttons
- **Shape:** retangular, sem raio, borda sólida e altura mínima de 48px.
- **Primary:** verde florestal com texto marfim, Arial semibold e espaço interno de 12px por 22px.
- **Secondary:** fundo transparente, contorno e texto verdes; hover recebe uma camada verde pálida.
- **Hover / Focus:** o principal escurece; o foco visível usa contorno verde de 3px deslocado 3px, compartilhado pelos controles.

### Chips
- **Style:** cápsulas compactas em Arial semibold de 12px, com preenchimento verde claro para publicado e mineral acinzentado para rascunho.
- **State:** o texto explicita a situação; cor é apoio visual, não o único sinal.

### Cards / Containers
- **Catalog item:** nicho retangular sem borda ou sombra, imagem dominante e legenda inferior contínua; ao hover, a imagem aproxima suavemente e o nome sublinha.
- **Admin row:** plano de linho, divisória fina, miniatura à esquerda e dados em grade; vira bloco compacto no celular.
- **Form panel:** plano de papel quente com borda superior verde e espaço interno amplo.

### Inputs / Fields
- **Style:** fundo de papel claro, texto quente, contorno mineral de 1px, canto reto e altura mínima de 48px.
- **Focus:** contorno global verde de 3px com deslocamento de 3px.
- **Error:** borda e mensagem mudam para argila escura; mensagens aparecem em texto junto ao campo.

### Navigation
- **Style:** barra clara com marca serifada à esquerda e links de texto à direita. Link ativo e hover recebem sublinhado. Em telas pequenas, a barra ganha altura livre e os links podem quebrar linha.

## Do's and Don'ts

### Do:
- **Do** manter nome e preço próximos da imagem para permitir comparação imediata.
- **Do** reservar a borda ilustrada para a continuidade das prateleiras da coleção.
- **Do** usar controles verdes retangulares e texto de apoio legível nas tarefas administrativas.
- **Do** identificar Casa Lira e seus produtos como demonstração fictícia onde o contexto exigir.

### Don't:
- **Don't** aplicar sombras de cartão aos nichos, linhas ou formulário.
- **Don't** substituir a serifada regular por um display de peso alto nos títulos.
- **Don't** usar a cápsula de estado como forma dos botões ou campos.

**Not canonized:** a etiqueta em caixa alta “DEMONSTRAÇÃO” no cabeçalho e o cabeçalho de lista em caixa alta permanecem fatos do build, mas não viram modelo de novos kickers ou eyebrows; são marcação funcional e tabela administrativa, respectivamente.
