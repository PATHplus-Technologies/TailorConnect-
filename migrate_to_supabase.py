"""
migrate_to_supabase.py
----------------------
Run this script ONCE after setting DATABASE_URL to your Supabase connection string.
It will:
  1. Apply all Django migrations to Supabase (creates tables)
  2. Load the exported SQLite data (data.json) into Supabase

Usage:
  1. Set DATABASE_URL environment variable to your Supabase connection string:
       $env:DATABASE_URL = "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
  2. Run:
       .\\TCvenv\\Scripts\\python.exe migrate_to_supabase.py
"""

import subprocess
import sys

PYTHON = sys.executable

print("=== Step 1: Running migrations on Supabase ===")
result = subprocess.run([PYTHON, "manage.py", "migrate"], check=True)

print("\n=== Step 2: Loading data from data.json into Supabase ===")
result = subprocess.run([PYTHON, "manage.py", "loaddata", "data.json"], check=True)

print("\n✅ Migration complete! Your data is now in Supabase.")
