import request from "supertest";
import { app } from "../../app";
import { setupSequelize, closeSequelize } from "../../__tests__setup";

describe("Checkout Routes", () => {
    beforeAll(async () => {
        await setupSequelize();
    });

    afterAll(async () => {
        await closeSequelize();
    });

    it("should process a checkout", async () => {
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

        // Finally, process checkout
        const response = await request(app).post("/checkout").send({
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

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("invoiceId");
        expect(response.body).toHaveProperty("transactionId");
        expect(response.body).toHaveProperty("status");
    });

    it("should return 400 if clientName is missing", async () => {
        const response = await request(app).post("/checkout").send({
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

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});
