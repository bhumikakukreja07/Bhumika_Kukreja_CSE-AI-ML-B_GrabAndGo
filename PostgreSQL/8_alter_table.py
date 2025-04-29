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

alter_table_query = """
ALTER TABLE list_of_card
ALTER COLUMN list_fav_category TYPE TEXT
USING array_to_string(list_fav_category, ', ');
"""

conn = None
cursor = None

try:
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()
    cursor.execute(alter_table_query)
    conn.commit()
    print("Table altered successfully: 'list_fav_category' column has been converted to a text.")
except Exception as e:
    print("An error occurred:", e)
    if conn:
        conn.rollback()
finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()