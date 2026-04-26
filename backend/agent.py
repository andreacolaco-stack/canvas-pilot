import os

from dotenv import load_dotenv
from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider

from .schema import Canvas

# 1. Load the .env file explicitly
load_dotenv()

# 2. Grab the key and create a Provider
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment!")

# 3. Manually link the Key to the Model
# Use 'google-gla' for Google AI Studio keys
provider = GoogleProvider(api_key=api_key)
model = GoogleModel("gemini-2.5-flash-lite", provider=provider)

# Initialize the Agent
# We use 'gemini-2.0-flash' for high-speed geometric reasoning
agent: Agent[None, Canvas] = Agent(
    model,
    output_type=Canvas,
    system_prompt=(
        "You are Canvas Pilot, a geometric expert. "
        "Your goal is to translate user descriptions into precise SVG data. "
        "Always center shapes unless specified otherwise. "
        "Use clean, professional color palettes."
    ),
)


async def generate_canvas(prompt: str) -> Canvas:
    print(f"🚀 Backend received prompt: {prompt}")
    result = await agent.run(prompt)
    return result.output
