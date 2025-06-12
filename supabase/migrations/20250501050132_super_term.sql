/*
  # Create contact messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text)
      - `phone` (text)
      - `message` (text, required)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for inserting messages
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);