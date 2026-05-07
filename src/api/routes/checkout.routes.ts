import { Router, Request, Response } from "express";
import * as yup from "yup";
import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../modules/payment/factory/payment.facade.factory";

const checkoutRoutes = Router();
const invoiceFacade = InvoiceFacadeFactory.create();
const paymentFacade = PaymentFacadeFactory.create();

const addressSchema = yup.object().shape({
    street: yup.string().required("Street is required"),
    number: yup.string().required("Number is required"),
    complement: yup.string().optional(),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zipCode: yup.string().required("ZipCode is required"),
});

const itemSchema = yup.object().shape({
    id: yup.string().required("Item id is required"),
    name: yup.string().required("Item name is required"),
    price: yup.number().required("Item price is required"),
});

const checkoutSchema = yup.object().shape({
    clientName: yup.string().required("Client name is required"),
    clientDocument: yup.string().required("Client document is required"),
    address: addressSchema,
    items: yup.array().of(itemSchema).required("Items are required"),
    amount: yup.number().required("Amount is required"),
});

checkoutRoutes.post("/", async (req: Request, res: Response) => {
    try {
        const { clientName, clientDocument, address, items, amount } = req.body;

        await checkoutSchema.validate({
            clientName,
            clientDocument,
            address,
            items,
            amount,
        });

        // Generate invoice
        const invoiceOutput = await invoiceFacade.generate({
            name: clientName,
            document: clientDocument,
            street: address.street,
            number: address.number,
            complement: address.complement,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
            items: items,
        });

        // Process payment
        const paymentOutput = await paymentFacade.process({
            orderId: invoiceOutput.id,
            amount: amount,
        });

        res.status(201).json({
            invoiceId: invoiceOutput.id,
            transactionId: paymentOutput.transactionId,
            status: paymentOutput.status,
        });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default checkoutRoutes;
