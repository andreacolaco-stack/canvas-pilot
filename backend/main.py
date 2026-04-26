from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .agent import generate_canvas
from .schema import Canvas

app = FastAPI(title="Canvas Pilot API")

# Allow your React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/generate", response_model=Canvas)
async def create_design(prompt: str):
    return await generate_canvas(prompt)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
