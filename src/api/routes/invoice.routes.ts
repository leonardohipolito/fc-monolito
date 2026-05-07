import { Router, Request, Response } from "express";
import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.facade.factory";

const invoiceRoutes = Router();
const invoiceFacade = InvoiceFacadeFactory.create();

invoiceRoutes.get("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const invoice = await invoiceFacade.find({ id });

        res.status(200).json(invoice);
    } catch (error) {
        res.status(404).json({ error: (error as Error).message });
    }
});

export default invoiceRoutes;
