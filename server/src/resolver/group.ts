import {Arg, Args, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql";
import {User} from "@sentry/types";
import {Group} from "../entity/group";
import {prisma} from "../db";
import {Component} from "../entity/component";
import {Metric} from "../entity/metric";

@Resolver(Group)
export class GroupResolver {
    // constructor(private recipeService: RecipeService) {}

    // @Query(returns => Recipe)
    // async recipe(@Arg("id") id: string) {
    //     const recipe = await this.recipeService.findById(id);
    //     if (recipe === undefined) {
    //         throw new RecipeNotFoundError(id);
    //     }
    //     return recipe;
    // }

    @Query(returns => [Group])
    groups() {
        return prisma.group.findMany({});
    }

    @FieldResolver(() => [Component])
    async components(@Root() group: Group) {
        return await prisma.component.findMany(
            {
                include: {
                    status: {
                        orderBy: {
                            date: 'asc',
                        }
                    },
                },
                where: {
                    groupId: group.id,
                },
                take: 60,
            },
        );
    }

    @FieldResolver(() => [Metric])
    async metrics(@Root() group: Group) {
        return await prisma.metric.findMany(
            {
                include: {
                    values: {
                        orderBy: {
                            date: 'asc',
                        }
                    },
                },
                where: {
                    groupId: group.id,
                },
                take: 60,
            },
        );
    }

    // @Mutation(returns => Recipe)
    // @Authorized()
    // addRecipe(
    //     @Arg("newRecipeData") newRecipeData: NewRecipeInput,
    //     @Ctx("user") user: User,
    // ): Promise<Recipe> {
    //     return this.recipeService.addNew({ data: newRecipeData, user });
    // }
    //
    // @Mutation(returns => Boolean)
    // @Authorized(Roles.Admin)
    // async removeRecipe(@Arg("id") id: string) {
    //     try {
    //         await this.recipeService.removeById(id);
    //         return true;
    //     } catch {
    //         return false;
    //     }
    // }
}