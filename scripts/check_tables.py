from db_utils import connect


try:
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
    for (table_name,) in cursor.fetchall():
        print(table_name)
    cursor.close()
    conn.close()
except Exception as error:
    print(f"Table check failed: {error}")
