"""Shared, environment-only database configuration for maintenance scripts."""

import os

import psycopg2


def connect():
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL must be set; copy backend/.env.example for local setup.")
    return psycopg2.connect(database_url)
