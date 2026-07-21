import sys

from db_utils import connect


try:
    conn = connect()
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute("CREATE EXTENSION IF NOT EXISTS postgis CASCADE;")
    cursor.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto CASCADE;")
    cursor.close()
    conn.close()
    print("Database extensions initialized.")
    sys.exit(0)
except Exception as error:
    print(f"Extension initialization failed: {error}")
    sys.exit(1)
