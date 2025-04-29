import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()  # loads the .env file

EMAIL_PASS = os.getenv("EMAIL_PASS")

conn_params = {
    # "host": "192.168.1.201", # this is home router local-ip
    "host": "122.163.179.252", # this is home router global-ip
    "port": 5432,
    "dbname": "food_db",  
    "user": "bhumika",    
    "password": EMAIL_PASS
}

source_table = "sample_table"   # Source table name
target_table = "user_otp"  # Target table name

conn = None
cursor = None

try:
    # Establish a connection to the PostgreSQL server
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()
    
    # Copy data from source_table to target_table
    duplicate_query = f"""
        INSERT INTO {target_table} 
        SELECT * FROM {source_table};
    """
    
    cursor.execute(duplicate_query)
    conn.commit()  # Commit the transaction
    
    print(f"Data successfully copied from {source_table} to {target_table}.")

except Exception as e:
    print("An error occurred:", e)

finally:
    # Clean up: close cursor and connection
    if cursor is not None:
        cursor.close()
    if conn is not None:
        conn.close()