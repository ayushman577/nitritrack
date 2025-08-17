import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Runs every day at 2am
cron.schedule('0 2 * * *', async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  // Find items older than 6 days (reminder)
  const { data: items } = await supabase.from('items').select('*').lt('created_at', new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString());
  if (items) {
    for (const item of items) {
      // Send reminder email if not already sent
      if (!item.reminder_sent) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: item.contact_info,
          subject: 'Reminder: Your Lost & Found post will be removed soon',
          text: `Your post titled "${item.title}" will be removed in 1 day. Update if still relevant.`
        });
        await supabase.from('items').update({ reminder_sent: true }).eq('id', item.id);
      }
    }
  }
  // Remove items older than 7 days
  await supabase.from('items').delete().lt('created_at', sevenDaysAgo);
});
