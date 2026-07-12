sb_publishable_HnuCmFtpYjEdu_Eoab9WzQ_n5k_WqcP
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjenxbnbgjqkcjmnvqyu.supabase.co';

const supabaseAnonKey = 'sb_...'; // paste your full sb_ key here

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
