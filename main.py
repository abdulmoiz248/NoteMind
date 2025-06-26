from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import os
import shutil
from app.ingest import ingestDocument
from app.generate import askNoteMind

app = FastAPI(title="NoteMind FastAPI Backend")

DATA_DIR = "data"
EMBEDDINGS_DIR = "embeddings"
os.makedirs(DATA_DIR, exist_ok=True)

@app.get("/")
def root():
    return {"message": "NoteMind backend is live 🚀"}

@app.get("/subjects")
def listSubjects():
    files = os.listdir(EMBEDDINGS_DIR)
    subjects = list(set(f.split("_")[0] for f in files if f.endswith(".faiss")))
    return {"subjects": subjects}

@app.post("/ingest")
async def ingest(
    subject: str = Form(...),
    handwritten: bool = Form(False),
    file: UploadFile = File(...)
):
    filePath = os.path.join(DATA_DIR, file.filename)
    with open(filePath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        ingestDocument(filePath, subject, handwritten)
        return {"status": "success", "subject": subject}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def chat(subject: str = Form(...), query: str = Form(...)):
    try:
        answer = askNoteMind(query, subject)
        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
