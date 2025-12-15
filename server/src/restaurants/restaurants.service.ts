import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Country, Role } from '../types';

@Injectable()
export class RestaurantsService {
    constructor(private prisma: PrismaService) { }

    async findAll(userRole: Role, userCountry: Country) {
        const whereClause = userRole === 'ADMIN' ? {} : { country: userCountry };

        return this.prisma.restaurant.findMany({
            where: whereClause,
            include: {
                menuItems: true,
            },
        });
    }

    async findMenu(restaurantId: string, userRole: Role, userCountry: Country) {
        // First check if user can access this restaurant
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id: restaurantId },
        });

        if (!restaurant) {
            return null;
        }

        // Country access check (Admin bypasses this)
        if (userRole !== 'ADMIN' && restaurant.country !== userCountry) {
            return null;
        }

        return this.prisma.menuItem.findMany({
            where: { restaurantId },
        });
    }
}