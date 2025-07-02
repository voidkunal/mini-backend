import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import sendEmail from "../utils/sendEmail.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const notifyUsers = () => {
  cron.schedule("*/30 * * * *", async () => {
    console.log(" CRON JOB: Running overdue book notifier");

    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const borrowers = await Borrow.find({
        dueDate: { $lte: oneDayAgo },
        notified: false,
        returnDate: null,
      });

      for (const borrow of borrowers) {
        const { user, book } = borrow;

        if (!user || !user.email || !book || !book.title) continue;

        const fineAmount = calculateFine(borrow.dueDate);

        const message = `
          <p>Dear ${user.name},</p>
          <p>Your borrowed book <strong>"${book.title}"</strong> is <span style="color:red;">overdue</span>.</p>
          <p>Your current fine is <strong>₹${fineAmount}</strong>.</p>
          <p>Please return the book as soon as possible to avoid further charges.</p>
          <br/>
          <p>Thank you,<br/>Void Tech Library System</p>
        `;

        await sendEmail({
          email: user.email,
          subject: " Book Return Reminder - Fine Notice",
          message,
        });

        borrow.notified = true;
        borrow.fine = fineAmount;
        await borrow.save();

        console.log(` Email sent to ${user.email} for "${book.title}" with fine ₹${fineAmount}`);
      }
    } catch (error) {
      console.error(" CRON ERROR:", error.message);
    }
  });
};
