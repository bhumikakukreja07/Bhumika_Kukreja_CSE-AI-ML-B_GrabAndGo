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

    # Select the last row based on the primary key (assuming there is an 'id' column)
    select_query = "SELECT id FROM items_list ORDER BY id DESC LIMIT 1;"
    cursor.execute(select_query)
    last_row = cursor.fetchone()

    if last_row:
        last_id = last_row[0]
        # Delete the last row
        delete_query = "DELETE FROM items_list WHERE id = %s;"
        cursor.execute(delete_query, (last_id,))
        conn.commit()
        print(f"Deleted the last row with id: {last_id}")
    else:
        print("No rows found in items_list.")

except Exception as e:
    print("An error occurred:", e)

finally:
    # Clean up: close cursor and connection
    if cursor is not None:
        cursor.close()
    if conn is not None:
        conn.close()