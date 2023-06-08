import Product from '../../../domain/product/entity/product'
import UpdateProductUseCase from './update.product.usecase';

const product = new Product("123", "Product", 10);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(product),
        findAll: jest.fn(),
        update: jest.fn(),
        create: jest.fn()
    }
}

describe("Unit test update product use case", () => {
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const useCase = new UpdateProductUseCase(productRepository);

        const input = {
            id: "123",
            name: "Product updated",
            price: 11
        };

        const output = await useCase.execute(input);
        
        expect(output).toEqual(input);
    });

    it("should throw an error when an input product is invalid", async () => {
        const productRepository = MockRepository();
        const useCase = new UpdateProductUseCase(productRepository);

        const input = {
            id: "123",
            name: "",
            price: 11
        };

        await expect(useCase.execute(input)).rejects.toThrow("Name is required");

        input.name = "Product updated";
        input.price = -1;
        await expect(useCase.execute(input)).rejects.toThrow("Price must be greater than zero");
    });
});