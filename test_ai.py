import asyncio

from backend.agent import generate_canvas
from dotenv import load_dotenv

load_dotenv()
print("Key loaded!")


async def test():
    print("🚀 Asking Canvas Pilot to draw...")
    prompt = "A red circle in the middle and a blue square at the bottom right"

    try:
        result = await generate_canvas(prompt)
        print("\n✅ AI Response Received:")
        print(f"Canvas Size: {result.width}x{result.height}")
        for shape in result.shapes:
            # Use cx/cy for circles, x/y for everything else
            pos_x = getattr(shape, "cx", getattr(shape, "x", "N/A"))
            pos_y = getattr(shape, "cy", getattr(shape, "y", "N/A"))

            print(f"- Found a {shape.type}: {shape.color} at coords ({pos_x}, {pos_y})")
    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    asyncio.run(test())
