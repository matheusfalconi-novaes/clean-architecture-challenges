import Product from '../../../domain/product/entity/product'
import UpdateProductUseCase from './update.product.usecase';

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(new Product("123", "Product", 10)),
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

        await expect(useCase.execute(input)).rejects.toThrow("product: Name is required");
        
        input.name = "Product updated";
        productRepository.find.mockReturnValue(new Product("123", "Product updated", 10));
        
        input.price = -1;
        await expect(useCase.execute(input)).rejects.toThrow("product: Price must be greater than zero");
    });
});