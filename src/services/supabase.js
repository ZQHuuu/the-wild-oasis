import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ttsbwcwwpxdbrlatygoi.supabase.co'

// 安全注意：严禁将supabase的service_role secret key（服务端密钥）写在这里
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2J3Y3d3cHhkYnJsYXR5Z29pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNDQ5NzgsImV4cCI6MjA4NDkyMDk3OH0.hEjyQqX98kZOr4U8N1mXODmEYlHJ7sJG3hpQPGeYOUQ"

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;
export { supabaseUrl };