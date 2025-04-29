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

conn = None
cursor = None

try:
    # Establish a connection to the PostgreSQL server
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()

    # Define an SQL query to add a new column named "otp" to sample_table
    alter_query = """
    ALTER TABLE items_list
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
    """
    
    # Execute the ALTER TABLE query
    cursor.execute(alter_query)
    conn.commit()
    
    print("Column 'otp' added successfully.")

except Exception as e:
    print("An error occurred:", e)
    if conn:
        conn.rollback()

finally:
    # Clean up: close cursor and connection
    if cursor is not None:
        cursor.close()
    if conn is not None:
        conn.close()
