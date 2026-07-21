from db_utils import connect


try:
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("SELECT 1;")
    cursor.close()
    conn.close()
    print("Database connection succeeded.")
except Exception as error:
    print(f"Database connection failed: {error}")
