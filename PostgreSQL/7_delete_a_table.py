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
    
    # Define an SQL query to drop the table
    drop_table_query = "DROP TABLE IF EXISTS items_list;"
    
    # Execute the query
    cursor.execute(drop_table_query)
    conn.commit()
    
    print("Table 'main_user_table' deleted successfully.")

except Exception as e:
    print("An error occurred:", e)
    if conn:
        conn.rollback()

finally:
    # Clean up: close cursor and connection
    if cursor:
        cursor.close()
    if conn:
        conn.close()
