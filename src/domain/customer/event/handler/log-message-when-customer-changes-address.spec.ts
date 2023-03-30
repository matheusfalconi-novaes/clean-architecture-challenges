import EventDispatcher from '../../../@shared/event/event-dispatcher';
import Customer from '../../entity/customer';
import Address from '../../value-object/address';
import CustomerChangedAddressEvent from '../customer-changed-address.event';
import LogMessageWhenCustomerChangesAddressHandler from './log-message-when-customer-changes-address.handler';

describe("Log message when customer changes address event tests", () => {
    it("should notify the event when the customer changes the address", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new LogMessageWhenCustomerChangesAddressHandler();

        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zip", "City 1");
        customer.changeAddress(address);

        eventDispatcher.notify(new CustomerChangedAddressEvent(customer));
        expect(spyEventHandler).toHaveBeenCalledTimes(1);
    });
});