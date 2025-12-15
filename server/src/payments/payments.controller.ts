import { Controller, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../types';
import { UpdatePaymentMethodDto } from './dto';

@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) { }

    @Put(':id')
    @Roles('ADMIN')
    updatePaymentMethod(
        @Param('id') id: string,
        @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
        @Request() req,
    ) {
        return this.paymentsService.updatePaymentMethod(
            id,
            updatePaymentMethodDto,
            req.user.id,
            req.user.role,
        );
    }
}