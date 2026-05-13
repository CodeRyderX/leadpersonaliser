import io
from typing import List, Tuple

import pandas as pd


def parse_csv(file_bytes: bytes) -> Tuple[List[dict], pd.DataFrame]:
    df = pd.read_csv(io.BytesIO(file_bytes), encoding="utf-8-sig")
    df.fillna("", inplace=True)
    rows = [{k: str(v).strip() for k, v in row.items()} for row in df.to_dict(orient="records")]
    return rows, df


def build_output_csv(original_df: pd.DataFrame, personalised_lines: List[str]) -> bytes:
    df = original_df.copy()
    df.fillna("", inplace=True)
    df["personalised_line"] = personalised_lines
    return df.to_csv(index=False, encoding="utf-8-sig").encode("utf-8-sig")
