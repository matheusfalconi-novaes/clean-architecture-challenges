import request from "supertest";
import { app, sequelize } from '../../api/express';

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });
    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const productResponse = await request(app)
            .post("/product")
            .send({
                name: "Product",
                price: 10
            });
        expect(productResponse.status).toBe(200);
        expect(productResponse.body.name).toBe("Product");
        expect(productResponse.body.price).toBe(10);
    });

    it("should list a product", async () => {
        const productResponse = await request(app)
            .post("/product")
            .send({
                name: "Product 1",
                price: 10
            });
        expect(productResponse.status).toBe(200);
        const productResponse2 = await request(app)
            .post("/product")
            .send({
                name: "Product 2",
                price: 11
            });
        expect(productResponse2.status).toBe(200);

        const listOfProducts = await request(app).get("/product").send();

        expect(listOfProducts.status).toBe(200);
        expect(listOfProducts.body.products.length).toBe(2);
        const product1 = listOfProducts.body.products[0];
        expect(product1.name).toBe("Product 1");
        expect(product1.price).toBe(10);
        const product2 = listOfProducts.body.products[1];
        expect(product2.name).toBe("Product 2");
        expect(product2.price).toBe(11);
    });
});