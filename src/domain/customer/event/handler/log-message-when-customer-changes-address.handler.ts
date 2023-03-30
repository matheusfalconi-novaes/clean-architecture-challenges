import EventHandlerInterface from '../../../@shared/event/event-handler.interface';
import Customer from '../../entity/customer';
import CustomerChangedAddressEvent from '../customer-changed-address.event';

export default class LogMessageWhenCustomerChangesAddressHandler implements EventHandlerInterface<CustomerChangedAddressEvent> {
    handle(event: CustomerChangedAddressEvent): void {
        const eventData: Customer = event.eventData;
        const address = `Street: '${eventData.Address.street}', Number: '${eventData.Address.number}'. Zip: '${eventData.Address.zip}', City: '${eventData.Address.city}'`;
        console.log(`Endereço do cliente: ${eventData.id}, ${eventData.name} alterado para: ${address}`);
    }
}