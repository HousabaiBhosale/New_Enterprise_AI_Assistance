import os
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from langchain_core.tools import tool

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "reports")

def ensure_reports_dir():
    if not os.path.exists(REPORTS_DIR):
        os.makedirs(REPORTS_DIR)

@tool
def generate_pdf_report(title: str, content_lines: list[str], filename: str) -> str:
    """Generates a PDF report with the given title and text content. Returns the file path."""
    ensure_reports_dir()
    filepath = os.path.join(REPORTS_DIR, filename if filename.endswith('.pdf') else filename + '.pdf')
    
    c = canvas.Canvas(filepath, pagesize=letter)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(72, 750, title)
    
    c.setFont("Helvetica", 12)
    y_position = 710
    for line in content_lines:
        c.drawString(72, y_position, line)
        y_position -= 20
        if y_position < 72:
            c.showPage()
            c.setFont("Helvetica", 12)
            y_position = 750
            
    c.save()
    return f"PDF report saved successfully at {filepath}"

@tool
def generate_excel_report(data: list[dict], filename: str) -> str:
    """Generates an Excel report from a list of dictionaries. Returns the file path."""
    ensure_reports_dir()
    filepath = os.path.join(REPORTS_DIR, filename if filename.endswith('.xlsx') else filename + '.xlsx')
    
    df = pd.DataFrame(data)
    df.to_excel(filepath, index=False)
    return f"Excel report saved successfully at {filepath}"
