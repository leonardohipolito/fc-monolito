import request from "supertest";
import { app } from "../../app";
import { setupSequelize, closeSequelize } from "../../__tests__setup";

describe("Invoice Routes", () => {
    beforeAll(async () => {
        await setupSequelize();
    });

    afterAll(async () => {
        await closeSequelize();
    });

    it("should find an invoice", async () => {
        // First, create a product
        await request(app).post("/products").send({
            id: "1",
            name: "Test Product",
            description: "A test product",
            purchasePrice: 10.0,
            stock: 100,
        });

        // Then, create a client
        await request(app).post("/clients").send({
            id: "1",
            name: "Test Client",
            email: "test@example.com",
            document: "12345678900",
            address: {
                street: "Test Street",
                number: "123",
                complement: "Apt 1",
                city: "Test City",
                state: "TS",
                zipCode: "12345000",
            },
        });

        // Process checkout to create an invoice
        const checkoutResponse = await request(app).post("/checkout").send({
            clientName: "Test Client",
            clientDocument: "12345678900",
            address: {
                street: "Test Street",
                number: "123",
                complement: "Apt 1",
                city: "Test City",
                state: "TS",
                zipCode: "12345000",
            },
            items: [
                {
                    id: "1",
                    name: "Test Product",
                    price: 10.0,
                },
            ],
            amount: 10.0,
        });

        const invoiceId = checkoutResponse.body.invoiceId;

        // Now find the invoice
        const response = await request(app).get(`/invoice/${invoiceId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name");
        expect(response.body).toHaveProperty("document");
        expect(response.body).toHaveProperty("address");
        expect(response.body).toHaveProperty("items");
        expect(response.body).toHaveProperty("total");
        expect(response.body).toHaveProperty("createdAt");
    });

    it("should return 404 if invoice is not found", async () => {
        const response = await request(app).get("/invoice/non-existent-id");

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
    });
});
