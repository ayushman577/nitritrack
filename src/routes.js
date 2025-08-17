import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Middleware to check @nitrkl.ac.in email
function nitrEmailOnly(req, res, next) {
  const { email } = req.body;
  if (!email || !email.endsWith('@nitrkl.ac.in')) {
    return res.status(403).json({ error: 'Only @nitrkl.ac.in emails allowed.' });
  }
  next();
}

// Example: Post lost/found item
router.post('/item', async (req, res) => {
  const { title, description, date, location, type, contact_info, photo_url, user_id } = req.body;
  const { error } = await supabase.from('items').insert([
    { title, description, date, location, type, contact_info, photo_url, user_id }
  ]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ success: true });
});

// Example: Get all items
router.get('/items', async (req, res) => {
  const { data, error } = await supabase.from('items').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
