#!/usr/bin/env python3
"""
Test the new database-driven parser
"""

import os
from services.database_parser import DatabaseParser
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_parser():
    """Test the new database parser"""
    print("🧪 Testing New Database-Driven Parser")
    print("=" * 50)
    
    # Initialize the parser
    parser = DatabaseParser()
    
    # Test with sample SE content
    sample_se_content = """
#ORGNR 123456-7890
#RAR 2024 20240101 20241231
#VER 1000 50000
#VER 1100 250000
#VER 1200 150000
#VER 1290 75000
#VER 2000 100000
#VER 3000 500000
#VER 4000 300000
"""
    
    print("📊 Parsing sample SE content...")
    
    # Parse account balances
    accounts = parser.parse_account_balances(sample_se_content)
    print(f"Found {len(accounts)} accounts: {accounts}")
    
    # Parse RR data
    rr_data = parser.parse_rr_data(accounts)
    print(f"\n📈 RR Data ({len(rr_data)} items):")
    for item in rr_data[:5]:  # Show first 5 items
        print(f"  {item['label']}: {item['amount']}")
    
    # Parse BR data
    br_data = parser.parse_br_data(accounts)
    print(f"\n💰 BR Data ({len(br_data)} items):")
    for item in br_data[:5]:  # Show first 5 items
        print(f"  {item['label']}: {item['amount']}")
    
    print("\n✅ Parser test completed!")

if __name__ == "__main__":
    test_parser()
