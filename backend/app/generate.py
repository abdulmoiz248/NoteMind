import os, pickle, faiss
from google import genai
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

load_dotenv()
model = SentenceTransformer("all-MiniLM-L6-v2")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
genai_model = "gemini-2.5-flash"

def loadVectorDB(subject):
    index = faiss.read_index(f"embeddings/{subject}_index.faiss")
    with open(f"embeddings/{subject}_meta.pkl", "rb") as f:
        metadata = pickle.load(f)
    return index, metadata

def searchRelevantChunks(query, index, metadata, topK=5):
    queryVec = model.encode([query])
    D, I = index.search(queryVec, topK)
    return "\n\n".join(metadata[i]["chunk"] + f"\n(Page {metadata[i]['page']})" for i in I[0])

def askNoteMind(query, subject):
    index, metadata = loadVectorDB(subject)
    relevant = searchRelevantChunks(query, index, metadata)
    prompt = f"You are a study assistant. Notes:\n\n{relevant}\n\nQ: {query}"
    resp = client.models.generate_content(model=genai_model, contents=prompt)
    return resp.text
