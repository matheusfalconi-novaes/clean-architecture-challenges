import Product from '../../../domain/product/entity/product'
import FindProductUseCase from './find.product.usecase';

const product = new Product("123", "Product", 10.0);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
    }
};

describe("Unit test find product use case", () => {
    it("should find a product", async () => {
        const productRepository = MockRepository();
        const useCase = new FindProductUseCase(productRepository);
        const input = {
            id: "123"
        };
        const output = {
            id: "123",
            name: "Product",
            price: 10.0
        };
        const result = await useCase.execute(input);
        expect(result).toEqual(output);
    });
});