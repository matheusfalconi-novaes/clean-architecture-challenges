import Address from '../../entity/address';
import Customer from '../../entity/customer';
import CustomerChangedAddressEvent from '../customer/customer-changed-address.event';
import CustomerCreatedEvent from '../customer/customer-created.event';
import LogMessageWhenCustomerChangesAddressHandler from '../customer/handler/log-message-when-customer-changes-address.handler';
import LogMessageWhenCustomerIsCreated1Handler from '../customer/handler/log-message-when-customer-is-created-1.handler';
import LogMessageWhenCustomerIsCreated2Handler from '../customer/handler/log-message-when-customer-is-created-2.handler';
import SendEmailWhenProductIsCreatedHandler from '../product/handler/send-email-when-product-is-created.handler';
import ProductCreatedEvent from '../product/product-created.event';
import EventDispatcher from './event-dispatcher';

describe("Domain events tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister all events", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it("should notify all events", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0
        });

        // Quando o notify for executado o método handle() do handler deve ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalledTimes(1);
    });

    it("should notify all customer events", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new LogMessageWhenCustomerIsCreated1Handler();
        const eventHandler2 = new LogMessageWhenCustomerIsCreated2Handler();

        const spyEventHandlers = [jest.spyOn(eventHandler1, "handle"), 
            jest.spyOn(eventHandler2, "handle")];

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

        const customerCreatedEvent = new CustomerCreatedEvent({
            name: "Customer 1",
            address: {
                street: "street 1",
                number: 1,
                zip: "zip code",
                city: "city 1"
            },
            active: true,
        });

        eventDispatcher.notify(customerCreatedEvent);
        spyEventHandlers.forEach(spyEvent => {
            expect(spyEvent).toHaveBeenCalledTimes(1);
        });
    });

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