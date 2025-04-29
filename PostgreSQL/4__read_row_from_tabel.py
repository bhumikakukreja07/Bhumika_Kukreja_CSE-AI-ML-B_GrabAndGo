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
    
    # Define an SQL query to select all rows from sample_table
    select_query = "SELECT * FROM sample_table;"
    
    # Execute the query
    cursor.execute(select_query)
    
    # Fetch all rows
    rows = cursor.fetchall()
    
    if rows:
        print("Rows in sample_table:")
        for row in rows:
            print(row)
    else:
        print("No rows found in sample_table.")

except Exception as e:
    print("An error occurred:", e)

finally:
    # Clean up: close cursor and connection
    if cursor is not None:
        cursor.close()
    if conn is not None:
        conn.close()
