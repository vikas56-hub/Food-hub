import { Controller, Get, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('restaurants')
@UseGuards(JwtAuthGuard)
export class RestaurantsController {
    constructor(private restaurantsService: RestaurantsService) { }

    @Get()
    findAll(@Request() req) {
        return this.restaurantsService.findAll(req.user.role, req.user.country);
    }

    @Get(':id/menu')
    async findMenu(@Param('id') id: string, @Request() req) {
        const menu = await this.restaurantsService.findMenu(id, req.user.role, req.user.country);
        if (!menu) {
            throw new NotFoundException('Restaurant not found or access denied');
        }
        return menu;
    }
}