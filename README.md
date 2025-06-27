# NoteMind

NoteMind is an AI-powered note analyzer built to help students make the most out of their study material. Whether your notes are typed or handwritten, NoteMind lets you search, summarize, and generate questions from them — instantly.

## 💡 Why NoteMind?

During exam prep, flipping through endless PDFs to find whether you'd solved a question is exhausting. Ctrl+F doesn’t work on scanned notes. Handwritten? Even worse. So, instead of revising, I built NoteMind during a break between finals to solve that problem.

## 🚀 Features

* 🧠 **Ask Anything**: Query your uploaded notes with natural language.
* ✍️ **Typed or Handwritten**: OCR support for handwritten docs.
* 🗂️ **Auto Subject Sorting**: Organizes your notes by subject.
* 📌 **Context-Aware Answers**: Uses RAG (Retrieval-Augmented Generation) to fetch relevant context before generating answers.
* 🧾 **Summaries & Flashcards**: Generate quick recaps and flashcards for revision.
* ❓ **Quiz Generation**: Auto-create MCQs or short questions from content.

## 🧰 Tech Stack

* FastAPI
* FAISS Vector Store
* Easy OCR (for handwriting)
* Gemini

## 📂 How to Use

1. Clone the repo and go to backend folder
2. Install requirements:

   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server at port 5000:

   ```bash
   uvicorn main:app --reload
   ```
4. Open your frontend folder and run 
   ```bash
    npm run dev
   ```
5. Ask questions like:

   * "Did I solve CH4 Q8?"
   * "Summarize Chapter 5"
   * "Make 5 MCQs from my Analog notes"

## Design
![screencapture-localhost-3000-2025-06-27-22_21_05](https://github.com/user-attachments/assets/b6ed3f7c-b20f-4a25-a6de-b2596d2dcc54)
![screencapture-localhost-3000-2025-06-27-22_19_02](https://github.com/user-attachments/assets/c26f2522-b1df-4b37-a742-2e7f2307d420)
![screencapture-localhost-3000-2025-06-27-22_18_41](https://github.com/user-attachments/assets/35e2ad77-3479-4aa5-a377-7b23985e21cf)

## 🤝 Contributing

Pull requests welcome! If you have ideas (e.g., better OCR, support for diagrams), open an issue.

## 📜 License

MIT

---

Made during finals week instead of studying 🤙
