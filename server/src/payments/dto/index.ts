import { IsString } from 'class-validator';

export class UpdatePaymentMethodDto {
    @IsString()
    type: string;

    @IsString()
    last4: string;
}