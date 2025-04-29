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

try:
    # Establish a connection to the PostgreSQL server
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()

    # Define a SQL query to create a table (if it doesn't already exist)
    create_table_query = """
    CREATE TABLE IF NOT EXISTS cart (
        user_email VARCHAR NOT NULL,
        user_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL
    );
    """

    # Execute the query and commit the changes
    cursor.execute(create_table_query)
    conn.commit()
    print("Table created successfully.")

except Exception as e:
    print("An error occurred:", e)

finally:
    # Clean up: close cursor and connection
    if cursor:
        cursor.close()
    if conn:
        conn.close()
