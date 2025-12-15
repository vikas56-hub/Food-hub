import { IsString, IsInt, Min } from 'class-validator';

export class CreateOrderDto {
    // Order will be created for the authenticated user
}

export class AddOrderItemDto {
    @IsString()
    menuItemId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}