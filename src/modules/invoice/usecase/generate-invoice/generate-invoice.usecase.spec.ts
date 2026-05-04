import GenerateInvoiceUseCase from "./generate-invoice.usecase";

describe("Generate Invoice use case unit test", () => {
    it("should generate an invoice", async () => {
        const repository = {
            add: jest.fn(),
        };

        const usecase = new GenerateInvoiceUseCase(repository as any);

        const input = {
            name: "Invoice 1",
            document: "123.456.789-00",
            street: "Rua do Teste",
            number: "123",
            complement: "Sala 1",
            city: "Cidade",
            state: "ST",
            zipCode: "00000-000",
            items: [
                {
                    id: "item-1",
                    name: "Product 1",
                    price: 100,
                },
            ],
        };

        const result = await usecase.execute(input);

        expect(repository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items).toHaveLength(1);
        expect(result.total).toBe(100);
    });
});
