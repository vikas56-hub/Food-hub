import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';


@Injectable()
export class CountryGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Admin can access all countries
        if (user.role === 'ADMIN') {
            return true;
        }

        // For other roles, check if they're accessing their own country's data
        // This will be implemented in individual services based on the resource being accessed
        return true;
    }
}