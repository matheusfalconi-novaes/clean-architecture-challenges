import CreateProductUseCase from './create.product.usecase';

const MockRepository = () => {
    return {
        find: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Unit test create product use case", () => {
    it("should create a product", async () => {
        const productRepository = MockRepository();
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
        const productRepository = MockRepository();
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