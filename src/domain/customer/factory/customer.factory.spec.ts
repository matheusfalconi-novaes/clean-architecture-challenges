import Address from '../value-object/address';
import CustomerFactory from './customer.factory';

describe("Customer factory unit test", () => {
    it("should create a customer", () => {
        const customer = CustomerFactory.create("Customer 1");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Customer 1");
        expect(customer.Address).toBeUndefined();
    });

    it("should create a customer with an address", () => {
        const address = new Address("123 Main St", 1, "Anitown", "12345");
        const customer = CustomerFactory.createWithAddress("Customer 1", address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("Customer 1");
        expect(customer.Address).toBe(address);
    });
});