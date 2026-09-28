# Preparar dados e imagens de demonstração

Status: ready-for-agent

Progress: implementado

## Escopo

Produzir imagens fictícias locais de objetos para casa e um comando opcional, repetível, que crie cerca de 12 Produtos sem duplicações. Documentar origem e uso dos ativos.

## Aceite

Demonstração funciona sem imagens externas e repete o seed sem duplicar Produtos.

## Referências

- [Especificação](../spec.md)
- [Arquitetura](../architecture.md)
- [Briefing visual](../design-brief.md)

## Resultado

O seed opcional cria dez Produtos publicados e dois rascunhos somente quando o catálogo está vazio; execuções seguintes não duplicam dados. As fotos fictícias são arquivos locais em `apps/web/public/assets/plates/` e `apps/web/public/demo/`, sem dependência de imagens externas. O README descreve o seed e a localização dos ativos.
