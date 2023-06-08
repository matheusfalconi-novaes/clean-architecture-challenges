import Product from '../../../domain/product/entity/product';
import ListProductUseCase from './list.product.usecase';

const productA = new Product("123", "Product A", 10);
const productB = new Product("321", "Product B", 11);

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn().mockReturnValue(Promise.resolve([productA, productB])),
        create: jest.fn(),
        update: jest.fn()
    };
};

describe("Unit test for listing products use case", () => {
    it("should list a product", async () => {
        const productRepository = MockRepository();
        const useCase = new ListProductUseCase(productRepository);

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