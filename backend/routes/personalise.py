import base64
import json

from fastapi import APIRouter, UploadFile
from fastapi.responses import StreamingResponse

from services.claude_service import generate_line
from services.csv_service import build_output_csv, parse_csv
from utils.rate_limiter import rate_limited_delay

router = APIRouter()


@router.post("/personalise")
async def personalise(file: UploadFile):
    file_bytes = await file.read()
    rows, original_df = parse_csv(file_bytes)
    total = len(rows)
    personalised_lines = [""] * total

    async def event_stream():
        for i, row in enumerate(rows):
            progress_event = json.dumps({"type": "progress", "current": i + 1, "total": total})
            yield f"data: {progress_event}\n\n"

            line = await generate_line(row)
            personalised_lines[i] = line

            result_event = json.dumps({"type": "result", "index": i, "line": line})
            yield f"data: {result_event}\n\n"

            if i < total - 1:
                await rate_limited_delay()

        csv_bytes = build_output_csv(original_df, personalised_lines)
        csv_b64 = base64.b64encode(csv_bytes).decode("utf-8")
        complete_event = json.dumps({"type": "complete", "csv_b64": csv_b64})
        yield f"data: {complete_event}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
