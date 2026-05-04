import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("Invoice Facade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should generate and find an invoice", async () => {
        const facade = InvoiceFacadeFactory.create();

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
                { id: "item-1", name: "Product 1", price: 100 },
                { id: "item-2", name: "Product 2", price: 200 },
            ],
        };

        const output = await facade.generate(input);

        expect(output).toBeDefined();
        expect(output.id).toBeDefined();
        expect(output.total).toBe(300);
        expect(output.items).toHaveLength(2);

        const invoice = await facade.find({ id: output.id });

        expect(invoice).toBeDefined();
        expect(invoice.id).toBe(output.id);
        expect(invoice.items).toHaveLength(2);
        expect(invoice.total).toBe(300);
        expect(invoice.address.street).toBe(input.street);
        expect(invoice.createdAt).toBeInstanceOf(Date);
    });
});
