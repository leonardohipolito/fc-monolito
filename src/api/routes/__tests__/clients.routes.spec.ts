import request from "supertest";
import { app } from "../../app";
import { setupSequelize, closeSequelize } from "../../__tests__setup";

describe("Clients Routes", () => {
    beforeAll(async () => {
        await setupSequelize();
    });

    afterAll(async () => {
        await closeSequelize();
    });

    it("should create a client", async () => {
        const response = await request(app).post("/clients").send({
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

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toBe("Client created successfully");
    });

    it("should return 400 if name is missing", async () => {
        const response = await request(app).post("/clients").send({
            id: "2",
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

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});
