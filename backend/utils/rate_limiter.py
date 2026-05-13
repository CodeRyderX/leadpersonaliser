import asyncio
import random


async def rate_limited_delay():
    await asyncio.sleep(0.5)


async def exponential_backoff(attempt: int):
    await asyncio.sleep((2 ** attempt) + random.uniform(0, 0.5))
