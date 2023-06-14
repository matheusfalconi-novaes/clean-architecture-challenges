import { Sequelize } from 'sequelize-typescript';
import Product from '../../../domain/product/entity/product'
import UpdateProductUseCase from './update.product.usecase';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';

const product = new Product("123", "Product", 10);

describe("Integration test update product use case", () => {
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

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const useCase = new UpdateProductUseCase(productRepository);
        await productRepository.create(product);

        const input = {
            id: "123",
            name: "Product updated",
            price: 11
        };

        const output = await useCase.execute(input);
        
        expect(output).toEqual(input);
    });


    it("should throw an error when an input product is invalid", async () => {
        const productRepository = new ProductRepository();
        const useCase = new UpdateProductUseCase(productRepository);
        await productRepository.create(product);

        const input = {
            id: "123",
            name: "",
            price: 11
        };

        await expect(useCase.execute(input)).rejects.toThrow("product: Name is required");

        input.name = "Product updated";
        input.price = -1;
        await expect(useCase.execute(input)).rejects.toThrow("product: Price must be greater than zero");
    });
});