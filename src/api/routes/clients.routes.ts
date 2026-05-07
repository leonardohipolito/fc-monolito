import { Router, Request, Response } from "express";
import * as yup from "yup";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../modules/@shared/domain/value-object/address";

const clientsRoutes = Router();
const clientFacade = ClientAdmFacadeFactory.create();

const addressSchema = yup.object().shape({
    street: yup.string().required("Street is required"),
    number: yup.string().required("Number is required"),
    complement: yup.string().optional(),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zipCode: yup.string().required("ZipCode is required"),
});

const clientSchema = yup.object().shape({
    id: yup.string().optional(),
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    document: yup.string().required("Document is required"),
    address: addressSchema,
});

clientsRoutes.post("/", async (req: Request, res: Response) => {
    try {
        const { id, name, email, document, address } = req.body;

        await clientSchema.validate({
            id,
            name,
            email,
            document,
            address,
        });

        const addressVO = new Address(
            address.street,
            address.number,
            address.complement,
            address.city,
            address.state,
            address.zipCode
        );

        await clientFacade.add({
            id,
            name,
            email,
            document,
            address: addressVO,
        });

        res.status(201).json({ message: "Client created successfully" });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default clientsRoutes;
