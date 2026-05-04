import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import Invoice from "../domain/invoice.entity";
import InvoiceItem from "../domain/invoice-item.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
    async add(invoice: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipcode: invoice.address.zipCode,
            total: invoice.total,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        });

        for (const item of invoice.items) {
            await InvoiceItemModel.create({
                id: item.id,
                invoiceId: invoice.id.id,
                name: item.name,
                price: item.price,
            });
        }
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({
            where: { id },
            include: [InvoiceItemModel],
        });

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        const items = invoice.items.map(
            (item) =>
                new InvoiceItem({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price,
                })
        );

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(
                invoice.street,
                invoice.number,
                invoice.complement,
                invoice.city,
                invoice.state,
                invoice.zipcode
            ),
            items,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
        });
    }
}
