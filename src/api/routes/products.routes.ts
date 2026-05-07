import { Router, Request, Response } from "express";
import * as yup from "yup";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";

const productsRoutes = Router();
const productFacade = ProductAdmFacadeFactory.create();

const productSchema = yup.object().shape({
    id: yup.string().optional(),
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    purchasePrice: yup.number().required("Purchase price is required"),
    stock: yup.number().required("Stock is required"),
});

productsRoutes.post("/", async (req: Request, res: Response) => {
    try {
        const { id, name, description, purchasePrice, stock } = req.body;

        await productSchema.validate({
            id,
            name,
            description,
            purchasePrice,
            stock,
        });

        await productFacade.addProduct({
            id,
            name,
            description,
            purchasePrice,
            stock,
        });

        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default productsRoutes;
