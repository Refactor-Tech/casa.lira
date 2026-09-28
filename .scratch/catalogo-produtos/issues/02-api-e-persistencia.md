# Implementar API e persistência

Status: ready-for-agent
Progress: implementado

## Escopo

Criar esquema SQLite com Drizzle e migrações; implementar rotas públicas e administrativas Fastify, validação e regras de publicação/exclusão. Manter listener em `127.0.0.1`.

## Aceite

Testes de integração cobrem CRUD, validação, ordenação, visibilidade, republicação e exclusão.

## Referências

- [Especificação](../spec.md)
- [Arquitetura](../architecture.md)
- [Briefing visual](../design-brief.md)

## Resultado

API Fastify, migração Drizzle/SQLite e testes de integração implementados. `pnpm test` passou.
