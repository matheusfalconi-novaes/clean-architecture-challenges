import { Sequelize } from 'sequelize-typescript';
import OrderModel from './order.model';
import Order from '../../../../domain/checkout/entity/order';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import Customer from '../../../../domain/customer/entity/customer';
import Address from '../../../../domain/customer/value-object/address';
import Product from '../../../../domain/product/entity/product';
import CustomerModel from '../../../customer/repository/sequelize/customer.model';
import CustomerRepository from '../../../customer/repository/sequelize/customer.repository';
import ProductModel from '../../../product/repository/sequelize/product.model';
import ProductRepository from '../../../product/repository/sequelize/product.repository';
import OrderItemModel from './order-item.model';
import OrderRepository from './order.repository';

describe("Order repository tests", () => {
    let sequelize: Sequelize;
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([
            OrderModel,
            OrderItemModel,
            CustomerModel,
            ProductModel,
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "ZipCode 1", "city 1");
        customer.changeAddress(address);

        const product = new Product("123", "Product 1", 10);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("321", customer.id, [orderItem]);

        const productRepository = new ProductRepository();
        const customerRepository = new CustomerRepository();
        const orderRepository = new OrderRepository();

        await productRepository.create(product);
        await customerRepository.create(customer);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    quantity: orderItem.quantity,
                    price: orderItem.price,
                    order_id: order.id,
                    product_id: product.id
                }
            ]
        });
    });

    it("should update an order", async () => {
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "ZipCode 1", "city 1");
        customer.changeAddress(address);

        const product = new Product("123", "Product 1", 10);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("321", customer.id, [orderItem]);

        const productRepository = new ProductRepository();
        const customerRepository = new CustomerRepository();
        const orderRepository = new OrderRepository();

        await productRepository.create(product);
        await customerRepository.create(customer);
        await orderRepository.create(order);

        orderItem.changeItemProperties("New name", 10);
        order.changeItem(orderItem);

        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    quantity: orderItem.quantity,
                    price: orderItem.price,
                    order_id: order.id,
                    product_id: product.id
                }
            ]
        });
    });

    it("should find an order", async () => {
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "ZipCode 1", "city 1");
        customer.changeAddress(address);

        const product = new Product("123", "Product 1", 10);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("321", customer.id, [orderItem]);

        const productRepository = new ProductRepository();
        const customerRepository = new CustomerRepository();
        const orderRepository = new OrderRepository();

        await productRepository.create(product);
        await customerRepository.create(customer);
        await orderRepository.create(order);

        const orderFound = await orderRepository.find(order.id);

        expect(order).toStrictEqual(orderFound);
    });

    it("should find all orders", async () => {
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "ZipCode 1", "city 1");
        customer.changeAddress(address);

        const product = new Product("123", "Product 1", 10);

        const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
        const order = new Order("321", customer.id, [orderItem]);

        const orderItem2 = new OrderItem("2", product.name, product.price, product.id, 4);
        const order2 = new Order("456", customer.id, [orderItem2]);

        const productRepository = new ProductRepository();
        const customerRepository = new CustomerRepository();
        const orderRepository = new OrderRepository();

        await productRepository.create(product);
        await customerRepository.create(customer);
        await orderRepository.create(order);
        await orderRepository.create(order2);

        const ordersFound = await orderRepository.findAll();

        expect(ordersFound).toHaveLength(2);
        expect(ordersFound).toContainEqual(order);
        expect(ordersFound).toContainEqual(order2);
    });
});