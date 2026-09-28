# Estruturar o workspace e o contrato

Status: ready-for-agent
Progress: implementado

## Escopo

Criar o monorepo pnpm com `apps/web`, `apps/api` e `packages/contracts`; configurar TypeScript, scripts de desenvolvimento, build e verificação. Definir os tipos de Produto, entrada e erro compartilhados.

## Aceite

Workspace instala e compila; frontend e backend dependem apenas de `packages/contracts`.

## Referências

- [Especificação](../spec.md)
- [Arquitetura](../architecture.md)
- [Briefing visual](../design-brief.md)

## Resultado

Workspace pnpm com duas aplicações e pacote de tipos compartilhados. `pnpm build` passou.
