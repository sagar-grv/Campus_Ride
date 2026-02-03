import pypdf
import os

pdf_files = [
    "Campus Ride-Booking App Prototype – Technical Design and Architecture.pdf",
    "Campus Transport App – Product Requirements Document.pdf"
]

for pdf_file in pdf_files:
    print(f"--- Extracting content from: {pdf_file} ---")
    try:
        reader = pypdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        print(text)
    except Exception as e:
        print(f"Error reading {pdf_file}: {e}")
    print("\n" + "="*50 + "\n")
