import time
import random

class AIService:
    @staticmethod
    def generate_image(prompt):
        """
        Simulates calling OpenAI's DALL-E to generate an image.
        Returns a mock URL for now.
        """
        # Simulate network delay of a real AI generation (usually 3-5 seconds)
        time.sleep(2)
        
        # In a real implementation, you would use:
        # client = OpenAI(api_key=settings.OPENAI_API_KEY)
        # response = client.images.generate(...)
        # return response.data[0].url

        # For now, return a placeholder image based on keywords in the prompt
        if 'suit' in prompt.lower():
            return "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop"
        elif 'dress' in prompt.lower():
            return "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop"
        elif 'traditional' in prompt.lower() or 'african' in prompt.lower():
            return "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=1000&auto=format&fit=crop"
        
        # Default fallback
        return "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop"
