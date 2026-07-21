import os
import socket


regions = ["ap-south-1", "ap-southeast-1", "us-east-1", "us-west-1", "eu-central-1", "eu-west-1"]
project_ref = os.environ.get("SUPABASE_PROJECT_REF")

if not project_ref:
    raise RuntimeError("SUPABASE_PROJECT_REF must be set for this diagnostic.")

for region in regions:
    host = f"aws-0-{region}.pooler.supabase.com"
    try:
        socket.gethostbyname(host)
        print(f"{host}: resolved")
    except OSError as error:
        print(f"{host}: {error}")
