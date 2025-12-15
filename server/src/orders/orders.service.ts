import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../types';
import { AddOrderItemDto } from './dto';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, userCountry: string) {
        return this.prisma.order.create({
            data: {
                userId,
                country: userCountry,
                status: 'CREATED',
            },
            include: {
                orderItems: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });
    }

    async addItem(orderId: string, addOrderItemDto: AddOrderItemDto, userId: string, userRole: Role) {
        // Check if order exists and user has access
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Check access: user can only modify their own orders, unless they're admin
        if (userRole !== 'ADMIN' && order.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        // Check if order is still modifiable
        if (order.status !== 'CREATED') {
            throw new ForbiddenException('Cannot modify order in current status');
        }

        // Verify menu item exists and is from same country (unless admin)
        const menuItem = await this.prisma.menuItem.findUnique({
            where: { id: addOrderItemDto.menuItemId },
            include: { restaurant: true },
        });

        if (!menuItem) {
            throw new NotFoundException('Menu item not found');
        }

        if (userRole !== 'ADMIN' && menuItem.restaurant.country !== order.country) {
            throw new ForbiddenException('Cannot add items from different country');
        }

        return this.prisma.orderItem.create({
            data: {
                orderId,
                menuItemId: addOrderItemDto.menuItemId,
                quantity: addOrderItemDto.quantity,
            },
            include: {
                menuItem: true,
            },
        });
    }

    async checkout(orderId: string, userId: string, userRole: Role) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (userRole !== 'ADMIN' && order.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        if (order.status !== 'CREATED') {
            throw new ForbiddenException('Order cannot be checked out');
        }

        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'PLACED' },
            include: {
                orderItems: {
                    include: {
                        menuItem: true,
                    },
                },
            },
        });
    }

    async cancel(orderId: string, userId: string, userRole: Role) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // Only Admin and Manager can cancel orders
        if (!['ADMIN', 'MANAGER'].includes(userRole)) {
            throw new ForbiddenException('Insufficient permissions');
        }

        if (userRole === 'MANAGER' && order.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });
    }

    async getUserOrders(userId: string, userRole: Role, userCountry: string) {
        const whereClause: any = {};

        // Admin can see all orders, others only their own
        if (userRole !== 'ADMIN') {
            whereClause.userId = userId;
        }

        // Country filtering (Admin bypasses this)
        if (userRole !== 'ADMIN') {
            whereClause.country = userCountry;
        }

        return this.prisma.order.findMany({
            where: whereClause,
            include: {
                orderItems: {
                    include: {
                        menuItem: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}