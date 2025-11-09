import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      // Initialize user profile fields if they don't exist
      if (args.existingUserId) {
        const user = await ctx.db.get(args.existingUserId);
        if (user && !user.followersCount) {
          await ctx.db.patch(args.existingUserId, {
            followersCount: 0,
            followingCount: 0,
          });
        }
      }
    },
  },
});
