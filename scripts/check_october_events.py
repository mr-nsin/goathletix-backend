from db_utils import connect


try:
    conn = connect()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT city, COUNT(*)
        FROM public.events
        WHERE start_date >= '2026-10-01' AND start_date <= '2026-10-31'
        GROUP BY city
        ORDER BY COUNT(*) DESC;
        """
    )
    for city, count in cursor.fetchall():
        print(f"{city}: {count} events")
    cursor.close()
    conn.close()
except Exception as error:
    print(f"Event query failed: {error}")
