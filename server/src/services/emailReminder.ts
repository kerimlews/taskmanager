import nodemailer from 'nodemailer';
import cron from 'node-cron';
import Task, { ITask } from '../models/task.model';
import User, { IUser } from '../models/user.model';
import config from '../config';

export async function sendDueDateReminders(): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      secure: config.emailSecure,
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });

    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // tasks due within the next hour
    const tasksDue: ITask[] = await Task.find({
      dueDate: { $gte: now, $lte: now + oneHour },
    });

    for (const task of tasksDue) {
      const user: IUser | null = await User.findById(task.createdBy);
      if (!user || !user.email) continue;

      const mailOptions = {
        from: config.emailFrom,
        to: user.email,
        subject: `Task Reminder: ${task.title} is due soon`,
        text: `Hello,\n\nThis is a reminder that your task "${task.title}" is due at ${new Date(
          task.dueDate! // non-null assertion here
        ).toLocaleString()}. Please take the necessary action.\n\nThank you.`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Reminder sent for task ${task._id} to ${user.email}`);
    }
  } catch (err) {
    console.error('Error sending due date reminders:', err);
  }
}

export const scheduleDueDateReminders = (): void => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running due date reminder job...');
    await sendDueDateReminders();
  });
};
