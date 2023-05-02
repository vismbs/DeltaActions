import { z } from 'zod';
import { publicProcedure, trpcRouter } from './context.server';
import { prisma } from './db.server';

export const appRouter = trpcRouter({
    addTemplate: publicProcedure
        .input(z.object({
            tempID: z.string(),
            tempName: z.string(),
            tempCategory: z.string(),
            tempRole: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            const getCategory = await ctx.prisma.category.findUnique({
                where: {
                    Name: input.tempCategory
                },
                include: {
                    Roles: true
                }
            })

            const getRole = await ctx.prisma.role.findUnique({
                where: {
                    Name: input.tempRole
                },
            })

            if (!getCategory) throw new Error("Category Not Found")

            const createdTemplate = await ctx.prisma.template.create({
                data: {
                    ID: input.tempID,
                    Name: input.tempName,
                    categoryName: getCategory.Name as string,
                    roleName: getRole?.Name as string,
                    isActive: true
                },
            })

            return createdTemplate;
        })
});

export type AppRouter = typeof appRouter;
export const serverAPI = appRouter.createCaller({ prisma: prisma })