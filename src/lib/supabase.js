import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://drjaystuvpxezbihocks.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyamF5c3R1dnB4ZXpiaWhvY2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNTY5NjEsImV4cCI6MjA4OTkzMjk2MX0.jSr6DBGGyaSb8Cr5bojXp6LEcR_9XbIq7HBw7DNnRls'
)
