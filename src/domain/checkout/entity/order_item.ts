export default class OrderItem {

    private _id: string;
    private _productId: string;
    private _name: string;
    private _price: number;
    private _quantity: number;

    constructor(id: string, name: string, price: number, productId: string, quantity: number) {
        this._id = id;
        this._productId = productId;
        this._name = name;
        this._price = price;
        this._quantity = quantity;
        this.validate();
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get quantity(): number {
        return this._quantity;
    }

    get price(): number {
        return this._price;
    }

    get productId(): string {
        return this._productId;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Item id is required");
        }
        if (this.name.length === 0) {
            throw new Error("Item name is required");
        }
        if (this._price <= 0) {
            throw new Error("Price must be greater than 0");
        }
        if (this._productId.length === 0) {
            throw new Error("Product id is required");
        }
        if (this._quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }
    }

    changeItemProperties(name: string, quantity: number): void {
        this._name = name;
        this._quantity = quantity;
        this.validate();
    }

    orderItemTotal(): number {
        return this._price * this._quantity;
    }
}