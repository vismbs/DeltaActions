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

      if (!getCategory) return "Category Not Found"

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
        },
        include: {
          Category: {
            include: {
              Roles: true
            }
          }
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
  editTemplateName: publicProcedure
    .input(z.object({
      templateID: z.string(),
      templateName: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const updatedTemplate = await ctx.prisma.template.update({
        where: {
          ID: input.templateID
        },
        data: {
          Name: input.templateName,
        }
      })

      return updatedTemplate;
    }),
  editTemplateCategory: publicProcedure
    .input(z.object({
      templateID: z.string(),
      templateCategory: z.string(),
      templateRole: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const updatedTemplate = await ctx.prisma.template.update({
        where: {
          ID: input.templateID
        },
        data: {
          categoryName: input.templateCategory,
          roleName: input.templateRole
        }
      })

      return updatedTemplate;
    }),
  editTemplateRole: publicProcedure
    .input(z.object({
      templateID: z.string(),
      templateRole: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const updatedTemplate = await ctx.prisma.template.update({
        where: {
          ID: input.templateID
        },
        data: {
          roleName: input.templateRole
        }
      })

      return updatedTemplate;
    }),
  getCategory: publicProcedure
    .input(z.object({
      categoryName: z.string()
    }))
    .query(async ({ input, ctx }) => {
      const getCategory = await ctx.prisma.category.findUnique({
        where: {
          Name: input.categoryName
        },
        include: {
          Roles: true
        }
      })

      return getCategory;
    })
});

export type AppRouter = typeof appRouter;
export const serverAPI = appRouter.createCaller({ prisma: prisma });
