import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../../@shared/domain/value-object/address";
import Invoice from "../../domain/invoice.entity";
import InvoiceItem from "../../domain/invoice-item.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

describe("Find Invoice use case unit test", () => {
    it("should find an invoice", async () => {
        const invoice = new Invoice({
            id: new Id("1"),
            name: "Invoice 1",
            document: "123.456.789-00",
            address: new Address(
                "Rua do Teste",
                "123",
                "Sala 1",
                "Cidade",
                "ST",
                "00000-000"
            ),
            items: [
                new InvoiceItem({
                    id: new Id("item-1"),
                    name: "Product 1",
                    price: 100,
                }),
            ],
        });

        const repository = {
            find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
        };

        const usecase = new FindInvoiceUseCase(repository as any);

        const result = await usecase.execute({ id: "1" });

        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toBe("1");
        expect(result.name).toBe(invoice.name);
        expect(result.document).toBe(invoice.document);
        expect(result.address.street).toBe(invoice.address.street);
        expect(result.address.number).toBe(invoice.address.number);
        expect(result.address.complement).toBe(invoice.address.complement);
        expect(result.address.city).toBe(invoice.address.city);
        expect(result.address.state).toBe(invoice.address.state);
        expect(result.address.zipCode).toBe(invoice.address.zipCode);
        expect(result.items).toHaveLength(1);
        expect(result.total).toBe(invoice.total);
        expect(result.createdAt).toEqual(invoice.createdAt);
    });
});
