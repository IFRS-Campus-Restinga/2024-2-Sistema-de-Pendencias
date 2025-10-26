import asyncio
import aiohttp

class AsyncRequestService:
    @staticmethod
    async def fetch_json(session, url, params=None, cookies=None):
        async with session.get(url, params=params, cookies=cookies, timeout=10) as response:
            response.raise_for_status()
            return await response.json()

    @staticmethod
    async def fetch_multiple(tasks, cookies=None):
        """
        Executa múltiplas requisições simultaneamente.
        tasks: lista de dicts {"key": str, "url": str, "params": dict}
        Retorna dict {key: resultado_json}
        """
        cookies = cookies or {}
        async with aiohttp.ClientSession() as session:
            coros = [
                AsyncRequestService.fetch_json(session, t["url"], params=t.get("params"), cookies=cookies)
                for t in tasks
            ]
            results = await asyncio.gather(*coros, return_exceptions=False)
        
        return {t["key"]: r for t, r in zip(tasks, results)}

    @staticmethod
    def run_fetch(tasks, cookies=None):
        return asyncio.run(AsyncRequestService.fetch_multiple(tasks, cookies=cookies))
