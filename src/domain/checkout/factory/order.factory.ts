import Order from '../entity/order';
import OrderItem from '../entity/order_item';

interface OrderFactoryProps {
    id: string;
    customerId: string;
    items: {
        id: string;
        name: string;
        price: number;
        productId: string;
        quantity: number;
    }[]
}

export default class OrderFactory {
    public static create(orderProps: OrderFactoryProps): Order {
        return new Order(orderProps.id, orderProps.customerId, orderProps.items.map(item => {
            return new OrderItem(item.id, item.name, item.price, item.productId, item.quantity);
        }));
    }
}