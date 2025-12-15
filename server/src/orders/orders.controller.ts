import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../types';
import { AddOrderItemDto } from './dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private ordersService: OrdersService) { }

    @Post()
    create(@Request() req) {
        return this.ordersService.create(req.user.id, req.user.country);
    }

    @Post(':id/items')
    addItem(
        @Param('id') id: string,
        @Body() addOrderItemDto: AddOrderItemDto,
        @Request() req,
    ) {
        return this.ordersService.addItem(id, addOrderItemDto, req.user.id, req.user.role);
    }

    @Post(':id/checkout')
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'MANAGER')
    checkout(@Param('id') id: string, @Request() req) {
        return this.ordersService.checkout(id, req.user.id, req.user.role);
    }

    @Post(':id/cancel')
    @UseGuards(RolesGuard)
    @Roles('ADMIN', 'MANAGER')
    cancel(@Param('id') id: string, @Request() req) {
        return this.ordersService.cancel(id, req.user.id, req.user.role);
    }

    @Get('my-orders')
    getUserOrders(@Request() req) {
        return this.ordersService.getUserOrders(req.user.id, req.user.role, req.user.country);
    }
}