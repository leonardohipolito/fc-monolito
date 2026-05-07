# FC Monolito - API REST

Este projeto contém um módulo completo de sistemas monolíticos com uma **API REST** implementada com **Express** e testes **E2E** com **Supertest**, seguindo a arquitetura modular com Facade, Factory, Domain, Gateway, Repository e Use Cases.

## Arquitetura

O projeto segue a **Clean Architecture** com os seguintes módulos:

- **client-adm**: Administração de clientes
- **product-adm**: Administração de produtos
- **invoice**: Geração e consulta de notas fiscais
- **payment**: Processamento de pagamentos
- **store-catalog**: Catálogo da loja

## Como rodar os testes

1. Instale as dependências:

```bash
npm install
```

2. Execute a validação TypeScript e os testes (unitários + E2E):

```bash
npm run test
```

3. Para rodar apenas os testes de um módulo específico:

```bash
npx jest --runInBand src/modules/invoice
```

4. Para rodar apenas os testes E2E:

```bash
npx jest --runInBand src/api/routes/__tests__
```

## Endpoints da API

### Produtos
- **POST /products** - Cadastro de produto
  ```bash
  curl -X POST http://localhost:3000/products \
    -H "Content-Type: application/json" \
    -d '{
      "id": "1",
      "name": "Produto 1",
      "description": "Descrição",
      "purchasePrice": 10.0,
      "stock": 100
    }'
  ```

### Clientes
- **POST /clients** - Cadastro de cliente
  ```bash
  curl -X POST http://localhost:3000/clients \
    -H "Content-Type: application/json" \
    -d '{
      "id": "1",
      "name": "Cliente 1",
      "email": "cliente@email.com",
      "document": "12345678900",
      "address": {
        "street": "Rua X",
        "number": "123",
        "complement": "Apt 1",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01234-567"
      }
    }'
  ```

### Checkout
- **POST /checkout** - Realizar compra
  ```bash
  curl -X POST http://localhost:3000/checkout \
    -H "Content-Type: application/json" \
    -d '{
      "clientName": "Cliente 1",
      "clientDocument": "12345678900",
      "address": {
        "street": "Rua X",
        "number": "123",
        "complement": "Apt 1",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01234-567"
      },
      "items": [
        {
          "id": "1",
          "name": "Produto 1",
          "price": 10.0
        }
      ],
      "amount": 10.0
    }'
  ```

### Notas Fiscais
- **GET /invoice/:id** - Consultar nota fiscal
  ```bash
  curl http://localhost:3000/invoice/123e4567-e89b-12d3-a456-426614174000
  ```

## Tecnologias

- **TypeScript**: Linguagem de programação
- **Express**: Framework web
- **Sequelize**: ORM para banco de dados
- **SQLite**: Banco de dados em memória para testes
- **Supertest**: Testes E2E
- **Jest**: Framework de testes
- **Yup**: Validação de dados

## Estrutura de Testes

Os testes E2E estão em `src/api/routes/__tests__/`:

- `products.routes.spec.ts` - Testa criação de produtos
- `clients.routes.spec.ts` - Testa criação de clientes
- `checkout.routes.spec.ts` - Testa fluxo completo de compra
- `invoice.routes.spec.ts` - Testa consulta de notas fiscais

Cada teste valida:
- ✅ Status code (201 para criação, 200 para sucesso, 404 para não encontrado)
- ✅ Corpo da resposta com os dados corretos
- ✅ Tratamento de erros de validação (400)

## Módulo Invoice (Detalhes Anteriores)

O módulo foi implementado em `src/modules/invoice` e inclui:

- Entidades `Invoice` e `InvoiceItem`
- Value Object `Address`
- Use cases `GenerateInvoiceUseCase` e `FindInvoiceUseCase`
- Repositório com persistência Sequelize
- Facade e Factory para exposição do módulo
