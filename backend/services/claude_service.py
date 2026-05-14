import os

import anthropic
import anyio
import httpx

from utils.rate_limiter import exponential_backoff

SYSTEM_PROMPT = (
    "You are an expert cold email copywriter. Write a single personalised opening line for a cold email. "
    "It must sound human, specific, and natural — never generic. No more than 2 sentences. "
    "Always start with a greeting using the recipient's first name — either 'Hi', 'Hey', or 'Hello' followed "
    "by their first name and a comma (e.g. 'Hey Nick,' or 'Hi Sarah,') — then continue with the personalised line. "
    "Do not use 'Hope this finds you well' or any generic filler. Return only the opening line, nothing else."
)

_client = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(
            api_key=os.environ.get("ANTHROPIC_API_KEY"),
            http_client=httpx.Client(),
        )
    return _client


def build_user_prompt(row: dict) -> str:
    non_empty = {k: v for k, v in row.items() if v and str(v).strip()}
    row_data = "\n".join(f"{k}: {v}" for k, v in non_empty.items())
    return "Write a personalised opening line for a cold email based on the following information about the recipient:\n\n" + row_data


def _sync_call(row: dict) -> str:
    client = _get_client()
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=150,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": build_user_prompt(row)}],
    )
    return response.content[0].text.strip()


async def generate_line(row: dict, max_retries: int = 3) -> str:
    for attempt in range(max_retries):
        try:
            return await anyio.to_thread.run_sync(lambda: _sync_call(row))
        except anthropic.RateLimitError:
            if attempt < max_retries - 1:
                await exponential_backoff(attempt)
            else:
                return "[Rate limit reached — retry this lead manually]"
        except Exception as e:
            if attempt < max_retries - 1:
                await exponential_backoff(attempt)
            else:
                return f"[Error: {str(e)[:80]}]"
