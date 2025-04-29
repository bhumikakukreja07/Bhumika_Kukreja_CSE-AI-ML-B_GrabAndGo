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

# List of data tuples for multiple rows
data_to_insert = [
    ("screw_driver", "bla", "./assets/gif/online_maket_place_like_amazon_and_olx/my_amazon.gif", "['electric','mechanical']"),
    ("hammer", "another description", "./assets/gif/unity_game/unity1.gif", "['mechanical','construction','tools']"),
    ("speaker", "another description_3", "./assets/gif/unity_game/unity1.gif", "['electricals','audio','computer_hardwares']"),
    ("khushi_ka_milk", "another description_3", "./assets/gif/unity_game/unity1.gif", "['milk','cow','mooooo']"),
    ("tota_plas", "another description_2", "./assets/gif/unity_game/unity1.gif", "['mechanical','construction','tools']"),
    ("eiffel_tower", "another description_3", "./assets/gif/unity_game/unity1.gif", "['toy','sculpture','metal']"),
    # Add more tuples as needed
]

conn = None
cursor = None

try:
    # Establish a connection to the PostgreSQL server
    conn = psycopg2.connect(**conn_params)
    cursor = conn.cursor()

    # Update the SQL query to include all four placeholders.
    insert_query = """
    INSERT INTO items_list (id, title, description, img, list_fav_category)
    VALUES (DEFAULT, 'test_name', 'test_desc', 'test_path', 'test_cat')
    RETURNING *;

    """

    inserted_ids = []
    # Loop through each tuple and execute the insert query
    for row in data_to_insert:
        cursor.execute(insert_query, row)
        result = cursor.fetchone()
        if result:
            inserted_ids.append(result[0])
    
    conn.commit()
    print("Rows inserted successfully with IDs:", inserted_ids)

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
