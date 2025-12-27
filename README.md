# Cyberpunk admin dashboard

_Automatically synced with your [v0.app](https://v0.app) deployments_

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/divyamsingh4444s-projects/v0-cyberpunk-admin-dashboard)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/s2Kh3dGzB5B)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/divyamsingh4444s-projects/v0-cyberpunk-admin-dashboard](https://vercel.com/divyamsingh4444s-projects/v0-cyberpunk-admin-dashboard)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/s2Kh3dGzB5B](https://v0.app/chat/s2Kh3dGzB5B)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Supabase Setup

This project now uses Supabase as the database backend. To set up:

1. Create a Supabase project at [https://app.supabase.com](https://app.supabase.com)

2. Create the following tables in your Supabase database:

   - `devices` - Device information
   - `prompts` - Captured prompts
   - `events` - Device events
   - `blocked_prompts` - Blocked prompts

3. Create a `.env.local` file in the root directory with:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Get these values from your Supabase project dashboard:
   - Go to Settings → API
   - Copy the Project URL and anon/public key

### Database Schema

The API routes expect the following table structures:

**devices**

- `device_id` (text, primary key)
- `hostname` (text)
- `status` (text: 'active', 'inactive', 'offline', etc.)
- `os` (text)
- `ip_address` (text)
- `last_seen` (timestamp)
- `browser_count` (integer)
- `prompts_today` (integer)
- `total_prompts` (integer)

**prompts**

- `id` (uuid, primary key)
- `device_id` (text, foreign key to devices)
- `site` (text)
- `prompt` or `prompt_text` (text)
- `timestamp` (bigint - epoch milliseconds)
- `browser` or `browser_name` (text)
- `is_flagged` (boolean)
- `url` (text, optional)
- `username` (text, optional)

**events**

- `id` (uuid, primary key)
- `device_id` (text, foreign key to devices)
- `event_type` (text)
- `severity` (text: 'info', 'warning', 'critical')
- `description` (text)
- `timestamp` (bigint - epoch milliseconds)
- `site` (text, optional)
- `browser_name` (text, optional)
- `profile_name` (text, optional)
- `username` (text, optional)
- `url` (text, optional)
- `prompt` (text, optional)
- `hostname` (text, optional)

**blocked_prompts**

- `id` (uuid, primary key)
- `device_id` (text, foreign key to devices)
- `site` (text)
- `reason` (text)
- `timestamp` (timestamp or text)
