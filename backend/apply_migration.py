#!/usr/bin/env python3
"""
Script to apply the new database migration
"""

import os
import subprocess
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def apply_migration():
    """Apply the new database migration"""
    try:
        print("Applying database migration...")
        
        # Read the migration SQL file
        with open('supabase/migrations/20250803000000_create_variable_mapping_tables.sql', 'r') as f:
            migration_sql = f.read()
        
        # Split the SQL into individual statements
        statements = migration_sql.split(';')
        
        for statement in statements:
            statement = statement.strip()
            if statement and not statement.startswith('--'):
                try:
                    # Execute the SQL statement
                    result = supabase.rpc('exec_sql', {'sql': statement}).execute()
                    print(f"✅ Executed: {statement[:50]}...")
                except Exception as e:
                    print(f"⚠️  Statement failed (might already exist): {statement[:50]}...")
                    print(f"   Error: {e}")
        
        print("Migration completed!")
        
    except Exception as e:
        print(f"Error applying migration: {e}")

def verify_tables():
    """Verify that the new tables were created"""
    try:
        print("\nVerifying new tables...")
        
        # Check RR table
        try:
            rr_result = supabase.table('variable_mapping_rr').select('*').limit(1).execute()
            print("✅ variable_mapping_rr table created successfully")
        except Exception as e:
            print(f"❌ variable_mapping_rr table not found: {e}")
        
        # Check BR table
        try:
            br_result = supabase.table('variable_mapping_br').select('*').limit(1).execute()
            print("✅ variable_mapping_br table created successfully")
        except Exception as e:
            print(f"❌ variable_mapping_br table not found: {e}")
        
        # Check financial_data table
        try:
            fd_result = supabase.table('financial_data').select('*').limit(1).execute()
            print("✅ financial_data table created successfully")
        except Exception as e:
            print(f"❌ financial_data table not found: {e}")
        
    except Exception as e:
        print(f"Error verifying tables: {e}")

if __name__ == "__main__":
    apply_migration()
    verify_tables()
