#!/usr/bin/env python3
"""
Script to check financial data storage and table structure
"""

import os
import sys
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.supabase_service import supabase

# Load environment variables
load_dotenv()

def check_financial_data_structure():
    """Check the structure of the financial_data table"""
    try:
        print("🔍 Checking financial_data table structure...")
        
        # Get table columns
        result = supabase.rpc('exec_sql', {
            'sql': """
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'financial_data' 
            AND table_schema = 'public'
            ORDER BY ordinal_position
            """
        }).execute()
        
        print(f"\n📊 Financial Data Table Columns ({len(result.data)} columns):")
        print("-" * 60)
        for col in result.data:
            print(f"  {col['column_name']:<30} {col['data_type']:<15} {col['is_nullable']}")
        
        return result.data
        
    except Exception as e:
        print(f"❌ Error checking table structure: {e}")
        return []

def check_financial_data_content():
    """Check what data is stored in the financial_data table"""
    try:
        print("\n🔍 Checking financial_data table content...")
        
        # Get sample data
        result = supabase.table('financial_data').select('*').limit(5).execute()
        
        if result.data:
            print(f"\n📊 Financial Data Records ({len(result.data)} records):")
            print("-" * 60)
            for i, record in enumerate(result.data, 1):
                print(f"\nRecord {i}:")
                for key, value in record.items():
                    if key in ['id', 'created_at', 'updated_at']:
                        continue
                    if value is not None:
                        print(f"  {key}: {value}")
        else:
            print("📭 No financial data records found")
            
        return result.data
        
    except Exception as e:
        print(f"❌ Error checking table content: {e}")
        return []

def check_variable_mappings():
    """Check variable mappings to see what variables we have"""
    try:
        print("\n🔍 Checking variable mappings...")
        
        # Check RR mappings
        rr_result = supabase.table('variable_mapping_rr').select('variable_name, row_title').execute()
        print(f"\n📊 RR Variables ({len(rr_result.data)} variables):")
        print("-" * 60)
        for mapping in rr_result.data[:10]:  # Show first 10
            print(f"  {mapping['variable_name']:<30} {mapping['row_title']}")
        if len(rr_result.data) > 10:
            print(f"  ... and {len(rr_result.data) - 10} more")
        
        # Check BR mappings
        br_result = supabase.table('variable_mapping_br').select('variable_name, row_title').execute()
        print(f"\n📊 BR Variables ({len(br_result.data)} variables):")
        print("-" * 60)
        for mapping in br_result.data[:10]:  # Show first 10
            print(f"  {mapping['variable_name']:<30} {mapping['row_title']}")
        if len(br_result.data) > 10:
            print(f"  ... and {len(br_result.data) - 10} more")
            
        return {
            'rr_variables': [m['variable_name'] for m in rr_result.data],
            'br_variables': [m['variable_name'] for m in br_result.data]
        }
        
    except Exception as e:
        print(f"❌ Error checking variable mappings: {e}")
        return {'rr_variables': [], 'br_variables': []}

def main():
    """Main function to check financial data storage"""
    print("🏦 Financial Data Storage Check")
    print("=" * 60)
    
    # Check table structure
    columns = check_financial_data_structure()
    
    # Check table content
    data = check_financial_data_content()
    
    # Check variable mappings
    mappings = check_variable_mappings()
    
    # Summary
    print("\n📋 Summary:")
    print("-" * 60)
    print(f"  • Financial data table has {len(columns)} columns")
    print(f"  • Financial data table has {len(data)} records")
    print(f"  • RR mappings: {len(mappings.get('rr_variables', []))} variables")
    print(f"  • BR mappings: {len(mappings.get('br_variables', []))} variables")
    
    # Check if we have the expected columns
    all_variables = set(mappings.get('rr_variables', []) + mappings.get('br_variables', []))
    existing_columns = {col['column_name'] for col in columns}
    
    missing_columns = all_variables - existing_columns
    if missing_columns:
        print(f"\n⚠️  Missing columns in financial_data table:")
        for col in sorted(missing_columns)[:10]:  # Show first 10
            print(f"    - {col}")
        if len(missing_columns) > 10:
            print(f"    ... and {len(missing_columns) - 10} more")
    else:
        print("\n✅ All variable columns exist in financial_data table")

if __name__ == "__main__":
    main() 