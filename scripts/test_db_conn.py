import os
import socket
from urllib.parse import urlparse


def test_connection(host: str, port: int) -> None:
    try:
        with socket.create_connection((host, port), timeout=5):
            print(f"TCP connection to {host}:{port} succeeded.")
    except OSError as error:
        print(f"TCP connection to {host}:{port} failed: {error}")


if __name__ == "__main__":
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL must be set; copy backend/.env.example for local setup.")
    parsed = urlparse(database_url)
    if not parsed.hostname:
        raise RuntimeError("DATABASE_URL does not include a host.")
    test_connection(parsed.hostname, parsed.port or 5432)
