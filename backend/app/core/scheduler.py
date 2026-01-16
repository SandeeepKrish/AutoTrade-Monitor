import asyncio
from collections.abc import Callable, Awaitable


async def start_interval_task(interval_seconds: int, task: Callable[[], Awaitable[None]]):
  async def _runner():
    while True:
      await task()
      await asyncio.sleep(interval_seconds)

  asyncio.create_task(_runner())

