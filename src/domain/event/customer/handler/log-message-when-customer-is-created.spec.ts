import EventDispatcher from '../../@shared/event-dispatcher';
import CustomerCreatedEvent from '../customer-created.event';
import LogMessageWhenCustomerIsCreated1Handler from './log-message-when-customer-is-created-1.handler';
import LogMessageWhenCustomerIsCreated2Handler from './log-message-when-customer-is-created-2.handler';

describe("Log message when customer is created event tests", () => {
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
});