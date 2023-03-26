import torch
import asyncio
import pydash as _

from generate import generate

async def stream(prompt, tokenizer, model, device):
    sequence = torch.empty(0).to(device)
    async for token, is_finished in generate(prompt, tokenizer, model):
        sequence = torch.cat((sequence, token))
        if token < tokenizer.vocab_size:
            text = tokenizer.decode(sequence, skip_special_tokens=True)
            yield f"data: {text}\n\n"
            await asyncio.sleep(0.01)

        if is_finished:
            break