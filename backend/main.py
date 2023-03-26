from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import pydash as _
import torch
from path import Path

from stream import stream
from model import get_model
from config import config

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


app = FastAPI()
model, tokenizer = get_model(config)


@app.get("/generate")
async def generate_stream(prompt: str):
    return StreamingResponse(
        stream(prompt, tokenizer, model, device),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )
