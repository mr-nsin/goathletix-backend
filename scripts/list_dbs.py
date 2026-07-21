from db_utils import connect


try:
    conn = connect()
    cursor = conn.cursor()
    cursor.execute("SELECT datname FROM pg_database WHERE datistemplate = false;")
    for (database_name,) in cursor.fetchall():
        print(database_name)
    cursor.close()
    conn.close()
except Exception as error:
    print(f"Database listing failed: {error}")
