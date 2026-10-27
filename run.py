"""Launch script for the Agentic AI Chronic Disease Early Prediction & Decision-Support System."""

import sys
import webbrowser
import uvicorn

if __name__ == "__main__":
    print("=" * 68)
    print("  Agentic AI Chronic Disease Early Prediction & Decision Support")
    print("=" * 68)
    print("\n[+] Web Application Interface : http://127.0.0.1:8000/")
    print("[+] Interactive Swagger Docs  : http://127.0.0.1:8000/docs")
    print("\nPress CTRL+C to terminate the server.\n")

    # Launch browser window
    try:
        webbrowser.open("http://127.0.0.1:8000/")
    except Exception:
        pass

    # Start FastAPI Uvicorn dev server
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
