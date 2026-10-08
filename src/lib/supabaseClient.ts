import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pjbduafmrcxaaydruihh.supabase.co";
const supabaseKey = "sb_publishable_4EJbgmenyHjMV1CKUzhoJg_qu0znEGs";

export const supabase = createClient(supabaseUrl, supabaseKey);
