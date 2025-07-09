-- Allow null values for user_id to support anonymous users
ALTER TABLE public.user_settings ALTER COLUMN user_id DROP NOT NULL;