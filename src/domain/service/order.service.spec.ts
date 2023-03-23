import Customer from '../entity/customer';
import Order from '../entity/order';
import OrderItem from '../entity/order_item';
import OrderService from './order.service';

describe("Order service unit tests", () => {

    it("should place an order", () => {
        const customer = new Customer("c1", "Customer 1");
        const orderItem1 = new OrderItem("i1", "Item 1", 10, "p1", 1);
        
        const order = OrderService.placeOrder(customer, [orderItem1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });

    it("should throw error when placing an order with 0 items", () => {
        expect(() => {
            const customer = new Customer("c1", "Customer 1");
            const order = OrderService.placeOrder(customer, [])
        }).toThrowError("Order must have at least one item");
    });

    it("should get total of all orders", () => {
        const orderItem = new OrderItem("i1", "Item 1", 100, "product1", 1);
        const orderItem2 = new OrderItem("i2", "Item 2", 200, "product2", 2);

        const order = new Order("o1", "c1", [orderItem]);
        const order2 = new Order("o2", "c1", [orderItem2]);

        const total = OrderService.total([order, order2]);

        expect(total).toBe(500);
    });
});