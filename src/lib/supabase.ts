import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tqjakepjiezcbkexfbqc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxamFrZXBqaWV6Y2JrZXhmYnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NTk1OTUsImV4cCI6MjA5MTEzNTU5NX0.RcwqQ32CaaIj8UrYWgULi-PyjIdjKFBVPAh2iFgnrBM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
