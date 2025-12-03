import os
import re
import fitz  # PyMuPDF
import docx2txt
from typing import Tuple, List, Dict

ICONLIKE = set("•●○■□◆◇★☆▶▷◀◁✓✔✗✘❖✦✧❋❀❆✿⚫⚪🔹🔸📞✉️")
ASCII_PRINTABLE = set(chr(i) for i in range(32, 127))

def _normalize_ws(s: str) -> str:
    return re.sub(r"[ \t]+", " ", re.sub(r"\r?\n+", "\n", s)).strip()

def _non_ascii_ratio(s: str) -> float:
    if not s:
        return 0.0
    non_ascii = sum(1 for ch in s if ch not in ASCII_PRINTABLE and ch not in {"\n", "\t"})
    return non_ascii / max(1, len(s))

def _detect_table_like(text: str) -> bool:
    # Heuristics: many lines with multiple aligned gaps or box-drawing chars
    lines = [ln for ln in text.splitlines() if ln.strip()]
    if not lines:
        return False
    multi_gaps = sum(1 for ln in lines if re.search(r"( {3,}|\t.+\t)", ln))
    box_chars = sum(1 for ln in lines if re.search(r"[│┤┬┴┼─━┃╋╔╗╚╝]", ln))
    pipes = sum(1 for ln in lines if ln.count("|") >= 2)
    score = multi_gaps + box_chars + pipes
    return score >= max(6, len(lines) * 0.12)

def _pdf_extract_text_and_layout(pdf_path: str) -> Tuple[str, Dict]:
    doc = fitz.open(pdf_path)
    all_text = []
    layout_info = {
        "pages": len(doc),
        "suspect_columns_pages": 0,
        "header_footer_repeats": False,
    }
    header_bag = {}
    footer_bag = {}

    for page in doc:
        page_text = page.get_text()
        all_text.append(page_text)

        # Layout heuristics for columns + header/footer
        blocks = page.get_text("blocks")
        width = page.rect.width
        height = page.rect.height
        right_col_blocks = 0
        total_blocks = 0

        page_header_texts = []
        page_footer_texts = []

        for (x0, y0, x1, y1, text, *_rest) in blocks:
            if not text.strip():
                continue
            total_blocks += 1
            # right column heuristic (content placed beyond 55% width)
            if x0 > width * 0.55:
                right_col_blocks += 1
            # header/footer collection (top 10%, bottom 10%)
            if y1 <= height * 0.10:
                page_header_texts.append(_normalize_ws(text))
            if y0 >= height * 0.90:
                page_footer_texts.append(_normalize_ws(text))

        if total_blocks and (right_col_blocks / total_blocks) >= 0.35:
            layout_info["suspect_columns_pages"] += 1

        # Track repeated header/footer across pages
        hdr = "\n".join([t for t in page_header_texts if t])
        ftr = "\n".join([t for t in page_footer_texts if t])
        if hdr:
            header_bag[hdr] = header_bag.get(hdr, 0) + 1
        if ftr:
            footer_bag[ftr] = footer_bag.get(ftr, 0) + 1

    # If the same header/footer appears on many pages, flag
    header_repeat = any(cnt >= max(2, int(0.5 * layout_info["pages"])) for cnt in header_bag.values())
    footer_repeat = any(cnt >= max(2, int(0.5 * layout_info["pages"])) for cnt in footer_bag.values())
    layout_info["header_footer_repeats"] = header_repeat or footer_repeat

    return "\n".join(all_text), layout_info

def _docx_extract_text(docx_path: str) -> str:
    return docx2txt.process(docx_path)

def extract_text_and_ats(file_path: str) -> Tuple[Dict, List[str]]:
    """
    Returns:
      parsed_json: dict with raw_text and light metadata
      warnings: list of ATS warnings
    """
    ext = os.path.splitext(file_path)[1].lower()
    warnings: List[str] = []
    raw_text = ""
    meta = {}

    if ext == ".pdf":
        raw_text, layout = _pdf_extract_text_and_layout(file_path)
        meta.update(layout)
    elif ext == ".docx":
        raw_text = _docx_extract_text(file_path)
        meta = {"pages": None, "suspect_columns_pages": 0, "header_footer_repeats": False}
    else:
        raise ValueError("Unsupported file format. Please upload a PDF or DOCX.")

    raw_text = _normalize_ws(raw_text)
    text_len = len(raw_text)

    # ATS warnings
    if text_len < 150:
        warnings.append("Very little extractable text found (file might be scanned images). Consider exporting as text-based PDF or DOCX.")
    if _non_ascii_ratio(raw_text) > 0.03 or any(ch in ICONLIKE for ch in raw_text):
        warnings.append("Non-standard symbols/icons detected. Replace icons with plain text (e.g., use 'Phone:' instead of 📞).")
    if _detect_table_like(raw_text):
        warnings.append("Tabular/multi-column layout detected. Simplify to single-column text — ATS often misreads tables.")
    if meta.get("suspect_columns_pages", 0) >= 1:
        warnings.append("Multi-column layout detected in PDF pages. Prefer single-column resumes for ATS.")
    if meta.get("header_footer_repeats"):
        warnings.append("Repeated header/footer content detected. Make sure contact info is in the main body (ATS may ignore headers/footers).")

    parsed_json: Dict = {
        "raw_text": raw_text,               # Full text
        "text_length": text_len,
        "meta": meta,                       # Layout hints (pages, columns, headers/footers)
    }

    return parsed_json, warnings
