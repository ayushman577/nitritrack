import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import cron from 'node-cron';
import nodemailer from 'nodemailer';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Auth route (email/password)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });
  res.json(data);
});

// Create complaint
app.post('/api/complaints', async (req, res) => {
  const { title, description, location, dateLost, photo, contact_info, user_id } = req.body;
  const { data, error } = await supabase.from('complaints').insert([
    { title, description, location, date_lost: dateLost, photo, contact_info, user_id }
  ]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// List complaints
app.get('/api/complaints', async (req, res) => {
  const { data, error } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Delete complaint
app.delete('/api/complaints/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('complaints').delete().eq('id', id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// Cron job: check for 7-day old complaints, send reminder, remove if not re-registered
cron.schedule('0 2 * * *', async () => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString();
  // Find complaints older than 6 days (reminder)
  const { data: complaints } = await supabase.from('complaints').select('*').lt('created_at', sixDaysAgo);
  if (complaints) {
    for (const c of complaints) {
      if (!c.reminder_sent) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: c.contact_info,
          subject: 'Reminder: Your Lost & Found complaint will be removed soon',
          text: `Your complaint titled "${c.title}" will be removed in 1 day. Please update if still relevant.`
        });
        await supabase.from('complaints').update({ reminder_sent: true }).eq('id', c.id);
      }
    }
  }
  // Remove complaints older than 7 days
  await supabase.from('complaints').delete().lt('created_at', sevenDaysAgo);
});

// ...existing code...
