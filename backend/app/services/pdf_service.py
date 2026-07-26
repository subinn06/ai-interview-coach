import pdfplumber

class PDFService:
    def extract_text(self, file_path: str) -> str:
        extracted_text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"
        except Exception as e:
            print(f"[PDFService] Extraction warning for {file_path}: {e}")

        return self.clean_text(extracted_text)

    def clean_text(self, text: str) -> str:
        return " ".join(text.split())
