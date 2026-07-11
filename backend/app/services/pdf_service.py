import pdfplumber

class PDFService:
    def extract_text(self, file_path: str) -> str:
        extracted_text = ""
        # open the pdf file and iterate through pages
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
                    
        return self.clean_text(extracted_text)

    def clean_text(self, text: str) -> str:
        # clean excessive spacing and normalize whitespaces
        return " ".join(text.split())
