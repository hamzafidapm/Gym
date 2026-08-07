import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables",
  );
}

// Not wired to the generic `Database` type in ./types.ts -- that file is
// hand-maintained (this sandbox can't reach the project to run
// `supabase gen types`) and its shape doesn't line up cleanly with
// supabase-js's Database generic across query builder / rpc() overloads.
// Query/mutation call sites (lib/supabase/queries.ts, AppStateContext) cast
// row shapes explicitly instead. Regenerate real types per supabase/README.md
// and re-wire `createClient<Database>` once this can reach the project.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
