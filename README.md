# FC Monolito

Este projeto contém um módulo de Invoice implementado dentro do monólito, seguindo a arquitetura modular com Facade, Factory, Domain, Gateway, Repository e Use Cases.

## Como rodar os testes

1. Instale as dependências:

```bash
npm install
```

2. Execute a validação TypeScript e os testes:

```bash
npm test
```

3. Para rodar apenas os testes do módulo Invoice:

```bash
npx jest --runInBand src/modules/invoice
```

## Módulo Invoice

O módulo foi implementado em `src/modules/invoice` e inclui:

- Entidades `Invoice` e `InvoiceItem`
- Value Object `Address`
- Use cases `GenerateInvoiceUseCase` e `FindInvoiceUseCase`
- Repositório com persistência Sequelize
- Facade e Factory para exposição do módulo
