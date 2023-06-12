import express, { Request, Response } from 'express';
import CreateProductUseCase from '../../../usecase/product/create/create.product.usecase';
import ProductRepository from '../repository/sequelize/product.repository';
import { InputCreateProductDto } from '../../../usecase/product/create/create.product.dto';
import ListProductUseCase from '../../../usecase/product/list/list.product.usecase';

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const useCase = new CreateProductUseCase(new ProductRepository());
    try {
        const productDto: InputCreateProductDto = {
            name: req.body.name,
            price: req.body.price
        };
        const output = await useCase.execute(productDto);
        res.status(200).send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.get("/", async (req: Request, res: Response) => {
    const useCase = new ListProductUseCase(new ProductRepository());
    try {
        const output = await useCase.execute({});
        res.status(200).send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});