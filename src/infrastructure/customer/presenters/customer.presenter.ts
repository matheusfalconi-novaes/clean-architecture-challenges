import { toXML } from "jstoxml";
import { OutputListCustomerDto } from "../../../usecase/customer/list/list.customer.dto";

export default class CustomerPresenter {
  static listXML(data: OutputListCustomerDto): string {
    const xmlOption = {
      header: true,
      index: " ",
      newline: "\n",
      allowEmpty: true,
    };
    return toXML(
      {
        customers: {
          customer: data.customers.map((customer) => ({
            id: customer.id,
            name: customer.name,
            address: {
              city: customer.address.city,
              number: customer.address.number,
              street: customer.address.street,
              zip: customer.address.zip,
            },
          })),
        },
      },
      xmlOption
    );
  }
}
