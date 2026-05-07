import request from "supertest";
import { app } from "../../app";
import { setupSequelize, closeSequelize } from "../../__tests__setup";

describe("Products Routes", () => {
    beforeAll(async () => {
        await setupSequelize();
    });

    afterAll(async () => {
        await closeSequelize();
    });

    it("should create a product", async () => {
        const response = await request(app).post("/products").send({
            id: "1",
            name: "Test Product",
            description: "A test product",
            purchasePrice: 10.0,
            stock: 100,
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Product created successfully");
    });

    it("should return 400 if name is missing", async () => {
        const response = await request(app).post("/products").send({
            id: "2",
            description: "A test product",
            purchasePrice: 10.0,
            stock: 100,
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});
