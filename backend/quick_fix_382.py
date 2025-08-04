#!/usr/bin/env python3
"""
Quick fix to make row 382 appear again
"""

import os
import sys
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def quick_fix_382():
    """Quick fix to make row 382 appear again"""
    print("🔧 Quick Fix for Row 382")
    print("=" * 30)
    
    try:
        # Temporarily set is_calculated to false to make the row appear
        result = supabase.table('variable_mapping_br').update({
            'is_calculated': False,
            'calculation_formula': None
        }).eq('row_id', 382).execute()
        
        print("✅ Row 382 set to non-calculated")
        print("The row should now appear in the preview")
        print("It will show 0 until we fix the calculation logic")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    quick_fix_382() 