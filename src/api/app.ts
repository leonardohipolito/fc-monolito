import express, { Express } from "express";
import productsRoutes from "./routes/products.routes";
import clientsRoutes from "./routes/clients.routes";
import checkoutRoutes from "./routes/checkout.routes";
import invoiceRoutes from "./routes/invoice.routes";

export const app: Express = express();

app.use(express.json());

app.use("/products", productsRoutes);
app.use("/clients", clientsRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/invoice", invoiceRoutes);

export default app;
