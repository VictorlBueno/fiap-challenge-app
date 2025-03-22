import { ProductRepository } from "@/domain/repositories/product.repository";
import { ProductEntity } from "@/domain/entities/product.entity";
import { PrismaService } from "@/infrastructure/shared/database/prisma/prisma.service";
import { ProductModelMapper } from "@/infrastructure/repositories/prisma/models/product-model.mapper";

export class ProductPrismaRepository implements ProductRepository {
    constructor(private prismaService: PrismaService) {}

    async delete(id: string): Promise<void> {
        await this.prismaService.product.delete({
            where: { id },
        });
    }

    async findAll(): Promise<ProductEntity[]> {
        const products = await this.prismaService.product.findMany();
        return products.map(item => ProductModelMapper.toEntity(item));
    }

    async findById(id: string): Promise<ProductEntity | null> {
        const product = await this.prismaService.product.findUnique({
            where: { id },
        });

        return product ? ProductModelMapper.toEntity(product) : null;
    }

    async insert(entity: ProductEntity): Promise<void> {
        await this.prismaService.product.create({
            data: {
                id: entity.props.id,
                name: entity.props.name,
                description: entity.props.description,
                price: entity.props.price,
                category: entity.props.category,
            },
        });
    }

    async listByCategory(categoryId: string): Promise<ProductEntity[]> {
        const products = await this.prismaService.product.findMany({
            where: {
                category: categoryId as any,
            },
        });

        return products.map(item => ProductModelMapper.toEntity(item));
    }

    async update(entity: ProductEntity): Promise<void> {
        await this.prismaService.product.update({
            where: { id: entity.props.id },
            data: {
                name: entity.props.name,
                description: entity.props.description,
                price: entity.props.price,
                category: entity.props.category,
            },
        });
    }
}
