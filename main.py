import os
from app.ingest import ingestDocument
from app.generate import askNoteMind

def listFiles(folder):
    files = [f for f in os.listdir(folder) if f.endswith((".pdf", ".txt", ".docx"))]
    return files

def runChat(subject):
    print(f"\n🧠 Chatting with subject: {subject}")
    while True:
        query = input("\n❓ Ask NoteMind (or type 'switch' / 'exit'): ")
        if query.lower() == "exit":
            print("👋 Exiting NoteMind...")
            break
        elif query.lower() == "switch":
            return
        else:
            response = askNoteMind(query, subject)
            print("\n💬 NoteMind:", response)

def main():
    while True:
        print("\n📚 Existing subjects:", [f.replace("_index.faiss", "") for f in os.listdir("embeddings") if f.endswith(".faiss")])
        action = input("\nType 'ingest' to add new file or enter subject name to chat: ").strip()

        if action.lower() == "ingest":
            files = listFiles("data")
            print("\n📄 Files in 'data/':")
            for idx, f in enumerate(files):
                print(f"{idx + 1}. {f}")
            fileIdx = int(input("\nSelect file number to ingest: ")) - 1
            subject = input("Enter subject name (e.g. math, physics): ").strip().lower()
            ingestDocument(f"data/{files[fileIdx]}", subject)
        elif action.lower() == "exit":
            break
        else:
            runChat(action.lower())

if __name__ == "__main__":
    main()
