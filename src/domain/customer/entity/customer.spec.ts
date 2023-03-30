import Address from '../value-object/address';
import Customer from './customer';

describe("Customer unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            new Customer("", "John");
        }).toThrowError("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            new Customer("123", "");
        }).toThrowError("Name is required");
    });

    it("should change name", () => {
        // Arrange
        const customer = new Customer("123", "John");

        // Act
        customer.changeName("Jane");

        // Assert
        expect(customer.name).toBe("Jane");
    });

    it("should activate customer", () => {
        // Arrange
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Street 1", 1, "000000-000", "city 1");
        customer.changeAddress(address);

        // Act
        customer.activate();

        // Assert
        expect(customer.isActive()).toBe(true);
    });

    it("should throw error when address is undefined when a customer is activated", () => {

        const customer = new Customer("1", "Customer 1");

        expect(() => customer.activate()).toThrowError("Address is mandatory to activate a customer");
    });

    it("should deactivate customer", () => {
        // Arrange
        const customer = new Customer("1", "Customer 1");

        // Act
        customer.deactivate();

        // Assert
        expect(customer.isActive()).toBe(false);
    });

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);
        
        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });

});