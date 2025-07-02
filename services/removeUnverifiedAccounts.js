import cron from "node-cron";
import { User } from "../models/userModel.js";

export const removeUnverifiedAccounts = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      const result = await User.deleteMany({
        accountVerified: false,
        createdAt: { $lt: thirtyMinutesAgo },
      });

      if (result.deletedCount > 0) {
        console.log(` Deleted ${result.deletedCount} unverified accounts older than 30 minutes.`);
      } else {
        console.log(" No unverified accounts to delete at this time.");
      }
    } catch (error) {
      console.error(" Error deleting unverified accounts:", error.message);
    }
  });
};
