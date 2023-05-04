import { z } from "zod";
import { publicProcedure, trpcRouter } from "./context.server";
import { prisma } from "./db.server";

export const appRouter = trpcRouter({
  addTemplate: publicProcedure
    .input(
      z.object({
        tempID: z.string(),
        tempName: z.string(),
        tempCategory: z.string(),
        tempRole: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const getCategory = await ctx.prisma.category.findUnique({
        where: {
          Name: input.tempCategory,
        },
        include: {
          Roles: true,
        },
      });

      const getRole = await ctx.prisma.role.findUnique({
        where: {
          Name: input.tempRole,
        },
      });

      if (!getCategory) throw new Error("Category Not Found");

      const createdTemplate = await ctx.prisma.template.create({
        data: {
          ID: input.tempID,
          Name: input.tempName,
          categoryName: getCategory.Name as string,
          roleName: getRole?.Name as string,
          isActive: true,
        },
      });

      return createdTemplate;
    }),
  getTemplates: publicProcedure.query(async ({ ctx }) => {
    const existingTemplate = await ctx.prisma.template.findMany();
    return existingTemplate;
  }),
  getSingleTemplate: publicProcedure
    .input(z.object({
      templateID: z.string()
    }))
    .query(async ({ input, ctx }) => {
      const uniqueTemplate = await ctx.prisma.template.findUnique({
        where: {
          ID: input.templateID
        }
      })

      return uniqueTemplate;
    }),
  deleteTemplate: publicProcedure
    .input(z.object({
      templateID: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const deletedTemplate = await ctx.prisma.template.delete({
        where: {
          ID: input.templateID
        }
      })

      return deletedTemplate
    }),
  editTemplate: publicProcedure
    .input(z.object({
      templateID: z.string(),
      templateName: z.string(),
      templateCategory: z.string(),
      templateRole: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const getTemplate = await ctx.prisma.template.findUnique({
        where: {
          ID: input.templateID
        }
      })

      const updatedTemplate = await ctx.prisma.template.update({
        where: {
          ID: getTemplate?.ID,
        },
        data: {
          Name: input.templateName,
          categoryName: input.templateCategory === "" ? getTemplate?.categoryName : input.templateCategory,
          isActive: getTemplate?.isActive,
          roleName: input.templateCategory === "" ? getTemplate?.categoryName : input.templateCategory
        }
      })

      return updatedTemplate;
    })
});

export type AppRouter = typeof appRouter;
export const serverAPI = appRouter.createCaller({ prisma: prisma });
