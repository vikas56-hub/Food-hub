import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../types';
import { UpdatePaymentMethodDto } from './dto';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    async updatePaymentMethod(
        paymentMethodId: string,
        updatePaymentMethodDto: UpdatePaymentMethodDto,
        userId: string,
        userRole: Role,
    ) {
        const paymentMethod = await this.prisma.paymentMethod.findUnique({
            where: { id: paymentMethodId },
        });

        if (!paymentMethod) {
            throw new NotFoundException('Payment method not found');
        }

        // Only Admin can update any payment method, others can only update their own
        if (userRole !== 'ADMIN' && paymentMethod.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        return this.prisma.paymentMethod.update({
            where: { id: paymentMethodId },
            data: updatePaymentMethodDto,
        });
    }

    async getUserPaymentMethods(userId: string) {
        return this.prisma.paymentMethod.findMany({
            where: { userId },
        });
    }
}