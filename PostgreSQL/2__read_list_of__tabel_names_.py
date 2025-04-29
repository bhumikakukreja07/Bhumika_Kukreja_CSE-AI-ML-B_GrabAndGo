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
    # Establish connection to PostgreSQL
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()

    # Query to list table names in the public schema
    list_tables_query = """
    SELECT tablename
    FROM pg_catalog.pg_tables
    WHERE schemaname = 'public';
    """
    cursor.execute(list_tables_query)
    tables = cursor.fetchall()

    if tables:
        print("Tables in the public schema:")
        for table in tables:
            print(table[0])
    else:
        print("No tables found in the public schema.")

except Exception as e:
    print("An error occurred:", e)

finally:
    if cursor is not None:
        cursor.close()
    if conn is not None:
        conn.close()
