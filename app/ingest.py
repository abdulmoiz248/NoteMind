import os
import faiss
import pickle
from tqdm import tqdm
from sentence_transformers import SentenceTransformer
from app.ocr_utils import extractTextFromDocument

CHUNK_SIZE = 300
CHUNK_OVERLAP = 50
EMBEDDINGS_DIR = "embeddings"
MODEL_NAME = "all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)

def chunkText(text, chunkSize=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunkSize
        chunks.append(text[start:end])
        start = end - overlap
    return chunks


def ingestDocument(filePath: str, subject: str, handwritten=False):
    data = extractTextFromDocument(filePath, handwritten=handwritten)
    allChunks, metadata = [], []

    for pageData in data:
        page = pageData["page"]
        text = pageData["text"]
        chunks = chunkText(text)

        for chunk in chunks:
            allChunks.append(chunk)
            metadata.append({
                "subject": subject,
                "page": page,
                "file": os.path.basename(filePath),
                "chunk": chunk
            })
        if not allChunks:
         print("⚠️ No readable text found in the document. Skipping embedding.")
         return

    

    print(f"Embedding {len(allChunks)} chunks...")
    embeddings = model.encode(allChunks, show_progress_bar=True)

    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)

    # Save both index and metadata
    os.makedirs(EMBEDDINGS_DIR, exist_ok=True)
    faiss.write_index(index, f"{EMBEDDINGS_DIR}/{subject}_index.faiss")
    with open(f"{EMBEDDINGS_DIR}/{subject}_meta.pkl", "wb") as f:
        pickle.dump(metadata, f)

    print(f"[✓] {subject} ingested successfully.")

