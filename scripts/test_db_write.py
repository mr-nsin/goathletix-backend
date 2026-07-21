import os

from db_utils import connect


try:
    if os.environ.get("ALLOW_DB_WRITE_TEST") != "1":
        raise RuntimeError("Set ALLOW_DB_WRITE_TEST=1 to run this destructive connectivity check.")
    conn = connect()
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS public.test_write_table (id SERIAL PRIMARY KEY);")
    cursor.execute("DROP TABLE public.test_write_table;")
    cursor.close()
    conn.close()
    print("Database write check succeeded.")
except Exception as error:
    print(f"Database write check failed: {error}")
