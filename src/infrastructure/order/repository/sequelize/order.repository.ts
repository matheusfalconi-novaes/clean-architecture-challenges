import Order from '../../../../domain/checkout/entity/order';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repository.interface';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            }))
        }, {
            include: [{ model: OrderItemModel }]
        });
    }

    async update(entity: Order): Promise<void> {
        const order = await OrderModel.findOne({
            where: {
                id: entity.id
            },
            include: [
                { model: OrderItemModel }
            ]
        });
        if (!order) {
            throw new Error("Could not found order");
        }

        order.customer_id = entity.customerId;
        order.total = entity.total();
        order.items.forEach(orderItem => {
            const entityItem = entity.items.find(item => item.id === orderItem.id);
            if (!entityItem) {
                throw new Error("One item were not found");
            }
            orderItem.name = entityItem.name;
            orderItem.price = entityItem.price;
            orderItem.quantity = entityItem.quantity;
        });

        await order.sequelize
            .transaction(async t => {
                return order
                    .save({ transaction: t })
                    .then(updatedOrder => {
                        updatedOrder.items.forEach(orderItem => orderItem.save())
                    });
            });
    }

    async find(id: string): Promise<Order> {
        const orderFound = await OrderModel.findOne({
            where: { id },
            include: [{ model: OrderItemModel }]
        });
        const orderItems = orderFound.items.map(orderItem =>
            new OrderItem(orderItem.id, orderItem.name, orderItem.price, orderItem.product_id, orderItem.quantity)
        );
        return new Order(orderFound.id, orderFound.customer_id, orderItems);
    }

    async findAll(): Promise<Order[]> {
        return (await OrderModel.findAll({include: [{ model: OrderItemModel }]}))
            .map(orderModel => {
                const orderItems = orderModel.items.map(orderItem =>
                    new OrderItem(orderItem.id, 
                        orderItem.name, 
                        orderItem.price, 
                        orderItem.product_id, 
                        orderItem.quantity)
                );
                return new Order(orderModel.id, orderModel.customer_id, orderItems);
            });
    }
}