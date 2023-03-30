import Order from './order';
import OrderItem from './order_item';

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            new Order("", "123", []);
        }).toThrowError("Id is required");
    });

    it("should throw error when customer id is empty", () => {
        expect(() => {
            new Order("123", "", []);
        }).toThrowError("CustomerId is required");
    });

    it("should throw error when items are empty", () => {
        expect(() => {
            new Order("123", "123", []);
        }).toThrowError("Items are required");
    });

    it("should throw error when trying to change an item that does not exist", () => {
        expect(() => {
            const item1 = new OrderItem("1", "Item 1", 100, "p1", 2);
            const item2 = new OrderItem("2", "Item 2", 200, "p2", 4);
            
            const order = new Order("123", "123", [item1]);
            order.changeItem(item2);

        }).toThrowError("Item does not exist");
    });

    it("should throw error when trying to change an existing item with invalid data", () => {
        expect(() => {
            const item1 = new OrderItem("1", "Item 1", 100, "p1", 2);
            const item2 = new OrderItem("1", "Item 1", 0, "p2", 4);
            
            const order = new Order("123", "123", [item1]);
            order.changeItem(item2);

        }).toThrowError();
    });

    it("should calculate total", () => {
        const item1 = new OrderItem("1", "Item 1", 100, "p1", 2);
        const item2 = new OrderItem("2", "Item 2", 200, "p2", 2);
        const order = new Order("o1", "c1", [item1]);

        let total = order.total();

        expect(total).toBe(200);

        const order2 = new Order("o2", "c2", [item1, item2]);

        total = order2.total();

        expect(total).toBe(600);
    });

    it("should throw error when item id is empty", () => {
        expect(() => {
            new OrderItem("", "Item 1", 100, "p1", 0);
        }).toThrowError("Item id is required");
    });

    it("should throw error when item name is empty", () => {
        expect(() => {
            new OrderItem("1", "", 100, "p1", 0);
        }).toThrowError("Item name is required");
    });

    it("should throw error when item price is less or equal to 0", () => {
        expect(() => {
            new OrderItem("123", "Item 1", 0, "p1", 0);
        }).toThrowError("Price must be greater than 0");
    });

    it("should throw error when item product id is empty", () => {
        expect(() => {
            new OrderItem("123", "Item 1", 100, "", 0);
        }).toThrowError("Product id is required");
    });

    it("should throw error when item qty is less or equal to 0", () => {
        expect(() => {
            new OrderItem("1", "Item 1", 100, "p1", 0);
        }).toThrowError("Quantity must be greater than 0");
    });

    it("should throw error when trying to change an item properties with invalid data", () => {
        expect(() => {
            const item = new OrderItem("1", "Item 1", 100, "p1", 2);
            item.changeItemProperties("Item 1", 0);
        }).toThrowError();
    });

});