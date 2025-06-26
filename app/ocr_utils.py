import os
import fitz  # for PDFs
from docx import Document
from tqdm import tqdm

def extractTextFromPDF(filePath: str):
    ext = os.path.splitext(filePath)[1].lower()
    extracted = []

    if ext == ".pdf":
        doc = fitz.open(filePath)
        for pageNum in tqdm(range(len(doc)), desc="Extracting from PDF"):
            page = doc[pageNum]
            text = page.get_text()
            extracted.append({
                "page": pageNum + 1,
                "text": text
            })

    elif ext == ".docx":
        doc = Document(filePath)
        text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
        extracted.append({
            "page": 1,
            "text": text
        })

    elif ext == ".txt":
        with open(filePath, "r", encoding="utf-8") as f:
            text = f.read()
        extracted.append({
            "page": 1,
            "text": text
        })

    else:
        raise ValueError(f"Unsupported file format: {ext}")

    return extracted


