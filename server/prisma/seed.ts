import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Create users - Nick Fury's team
    const nickFury = await prisma.user.create({
        data: {
            name: 'Nick Fury',
            email: 'nick.fury@shield.com',
            passwordHash: await bcrypt.hash('password123', 10),
            role: 'ADMIN',
            country: 'AMERICA',
        },
    });

    const captainMarvel = await prisma.user.create({
        data: {
            name: 'Captain Marvel',
            email: 'captain.marvel@shield.com',
            passwordHash: await bcrypt.hash('password123', 10),
            role: 'MANAGER',
            country: 'INDIA',
        },
    });

    const captainAmerica = await prisma.user.create({
        data: {
            name: 'Captain America',
            email: 'captain.america@shield.com',
            passwordHash: await bcrypt.hash('password123', 10),
            role: 'MANAGER',
            country: 'AMERICA',
        },
    });

    const thanos = await prisma.user.create({
        data: {
            name: 'Thanos',
            email: 'thanos@shield.com',
            passwordHash: await bcrypt.hash('password123', 10),
            role: 'MEMBER',
            country: 'INDIA',
        },
    });

    const thor = await prisma.user.create({
        data: {
            name: 'Thor',
            email: 'thor@shield.com',
            passwordHash: await bcrypt.hash('password123', 10),
            role: 'MEMBER',
            country: 'INDIA',
        },
    });

    const travis = await prisma.user.create({
        data: {
            name: 'Travis',
            email: 'travis@shield.com',
            passwordHash: await bcrypt.hash('password123', 10),
            role: 'MEMBER',
            country: 'AMERICA',
        },
    });

    // Create restaurants
    const restaurantIndia = await prisma.restaurant.create({
        data: {
            name: 'Spice Palace',
            country: 'INDIA',
        },
    });

    const restaurantAmerica = await prisma.restaurant.create({
        data: {
            name: 'Burger House',
            country: 'AMERICA',
        },
    });

    // Create menu items for India restaurant
    await prisma.menuItem.createMany({
        data: [
            {
                restaurantId: restaurantIndia.id,
                name: 'Butter Chicken',
                price: 15.99,
            },
            {
                restaurantId: restaurantIndia.id,
                name: 'Biryani',
                price: 12.99,
            },
            {
                restaurantId: restaurantIndia.id,
                name: 'Naan',
                price: 3.99,
            },
        ],
    });

    // Create menu items for America restaurant
    await prisma.menuItem.createMany({
        data: [
            {
                restaurantId: restaurantAmerica.id,
                name: 'Classic Burger',
                price: 8.99,
            },
            {
                restaurantId: restaurantAmerica.id,
                name: 'Fries',
                price: 4.99,
            },
            {
                restaurantId: restaurantAmerica.id,
                name: 'Milkshake',
                price: 5.99,
            },
        ],
    });

    // Create payment methods
    await prisma.paymentMethod.create({
        data: {
            userId: nickFury.id,
            type: 'S.H.I.E.L.D. Corporate Card',
            last4: '1234',
        },
    });

    await prisma.paymentMethod.create({
        data: {
            userId: captainMarvel.id,
            type: 'Cosmic Credit Card',
            last4: '5678',
        },
    });

    await prisma.paymentMethod.create({
        data: {
            userId: captainAmerica.id,
            type: 'Vibranium Card',
            last4: '9012',
        },
    });

    console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });