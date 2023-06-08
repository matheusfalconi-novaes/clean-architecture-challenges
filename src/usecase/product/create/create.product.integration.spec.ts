import { Sequelize } from 'sequelize-typescript';
import CreateProductUseCase from './create.product.usecase';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';

describe("Integration test create product use case", () => {
    let sequelize: Sequelize;
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });


    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);
        
        const input = {
            name: "Product 1",
            price: 10.0
        };

        const output = await useCase.execute(input);
        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            price: input.price
        });
    });

    it("should throw an error when a product is invalid", async () => {
        const productRepository = new ProductRepository();
        const useCase = new CreateProductUseCase(productRepository);
        
        const input = {
            name: "",
            price: 10.0
        };

        await expect(useCase.execute(input)).rejects.toThrow("Name is required");

        input.name = "Product 1";
        input.price = -1;

        await expect(useCase.execute(input)).rejects.toThrow("Price must be greater than zero");
    });
});