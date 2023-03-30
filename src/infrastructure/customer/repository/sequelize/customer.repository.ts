import Customer from '../../../../domain/customer/entity/customer';
import CustomerRepositoryInterface from '../../../../domain/customer/repository/customer-repository.interface';
import Address from '../../../../domain/customer/value-object/address';
import CustomerModel from './customer.model';

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            number: entity.Address.number,
            street: entity.Address.street,
            zipcode: entity.Address.zip,
            city: entity.Address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        });
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name,
                number: entity.Address.number,
                street: entity.Address.street,
                zipcode: entity.Address.zip,
                city: entity.Address.city,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints
            },
            {
                where: {
                    id: entity.id
                }
            }
        );
    }

    async find(id: string): Promise<Customer> {
        let customerFound;
        try {
            customerFound = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true });
        } catch (error) {
            throw new Error("Customer not found");
        }
        const customer = new Customer(customerFound.id, customerFound.name);
        const address = new Address(
            customerFound.street,
            customerFound.number,
            customerFound.zipcode,
            customerFound.city
        );
        customer.changeAddress(address);
        customer.addRewardPoints(customerFound.rewardPoints);
        if (customerFound.active) {
            customer.activate();
        }
        return customer;
    }

    async findAll(): Promise<Customer[]> {
        return (await CustomerModel.findAll()).map((customerModel) => {
            let customer = new Customer(customerModel.id, customerModel.name);
            customer.addRewardPoints(customerModel.rewardPoints);
            const address = new Address(
                customerModel.street,
                customerModel.number,
                customerModel.zipcode,
                customerModel.city
            );
            customer.changeAddress(address);
            if (customerModel.active) {
                customer.activate();
            }
            return customer;
        });
    }
}