import { Sequelize } from 'sequelize-typescript';
import ListProductUseCase from './list.product.usecase';
import ProductModel from '../../../infrastructure/product/repository/sequelize/product.model';
import ProductRepository from '../../../infrastructure/product/repository/sequelize/product.repository';
import Product from '../../../domain/product/entity/product';

const productA = new Product("123", "Product A", 10);
const productB = new Product("321", "Product B", 11);

describe("Unit test for listing products use case", () => {
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


    it("should list a product", async () => {
        const productRepository = new ProductRepository();
        const useCase = new ListProductUseCase(productRepository);
        await productRepository.create(productA);
        await productRepository.create(productB);

        const output = await useCase.execute({});

        expect(output.products.length).toBe(2);

        expect(output.products[0].id).toBe(productA.id);
        expect(output.products[0].name).toBe(productA.name);
        expect(output.products[0].price).toBe(productA.price);

        expect(output.products[1].id).toBe(productB.id);
        expect(output.products[1].name).toBe(productB.name);
        expect(output.products[1].price).toBe(productB.price);
    });
});