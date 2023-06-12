import express, { Express } from 'express';
import { Sequelize } from 'sequelize-typescript';
import CustomerModel from '../customer/repository/sequelize/customer.model';
import { customerRoute } from '../customer/api/customer.route';
import ProductModel from '../product/repository/sequelize/product.model';
import { productRoute } from '../product/api/product.route';

export const app: Express = express();
app.use(express.json());
app.use("/customer", customerRoute);
app.use("/product", productRoute);

export let sequelize: Sequelize;

async function setupDB() {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    });
    sequelize.addModels([CustomerModel, ProductModel]);
    await sequelize.sync();
}
setupDB();