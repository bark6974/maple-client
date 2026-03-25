/*
  # Discord Bot Management Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `discord_username` (text)
      - `subscription_tier` (text, default 'free')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `bot_configs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `server_id` (text)
      - `spam_enabled` (boolean)
      - `spam_message` (text)
      - `spam_interval` (integer)
      - `utility_features` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Users can only read/write their own profiles and bot configs
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  discord_username text,
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create bot_configs table
CREATE TABLE IF NOT EXISTS bot_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  server_id text NOT NULL,
  spam_enabled boolean DEFAULT false,
  spam_message text DEFAULT '',
  spam_interval integer DEFAULT 5,
  utility_features jsonb DEFAULT '{"moderation": false, "welcome": false, "automod": false}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bot_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bot configs"
  ON bot_configs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own bot configs"
  ON bot_configs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bot configs"
  ON bot_configs FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own bot configs"
  ON bot_configs FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());