from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import List
import os
import shutil
from app.ingest import ingestDocument
from app.generate import askNoteMind

app = FastAPI(title="NoteMind FastAPI Backend")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for frontend only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = "data"
EMBEDDINGS_DIR = "embeddings"
os.makedirs(DATA_DIR, exist_ok=True)

def successResponse(message: str, **kwargs):
    return JSONResponse(content={"status": "success", "message": message, **kwargs})

@app.get("/")
def root():
    return successResponse(message="NoteMind backend is live 🚀")

@app.get("/subjects")
def listSubjects():
    try:
        files = os.listdir(EMBEDDINGS_DIR)
        subjects = list(set(f.split("_")[0] for f in files if f.endswith(".faiss")))
        return successResponse(message="Subjects fetched successfully 🎯", subjects=subjects)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ingest")
async def ingest(
    subject: str = Form(...),
    handwritten: bool = Form(False),
    file: UploadFile = File(...)
):
    print("Received subject:", subject)
    print("Received handwritten:", handwritten)
    print("Received filename:", file.filename)

    filePath = os.path.join(DATA_DIR, file.filename)
    with open(filePath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        ingestDocument(filePath, subject, handwritten)
        return successResponse(
            message=f"Document for subject '{subject}' ingested successfully 💾",
            subject=subject
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def chat(subject: str = Form(...), query: str = Form(...)):
    try:
        answer = askNoteMind(query, subject)
        return successResponse(
            message="Response generated successfully 💬",
            subject=subject,
            query=query,
            answer=answer
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
