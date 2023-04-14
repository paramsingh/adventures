import requests
from io import BytesIO
from moviepy.editor import ImageClip, concatenate_videoclips, AudioFileClip, afx, vfx
from PIL import Image
import numpy as np
from gtts import gTTS
from config import OPENAI_API_KEY
import openai

openai.api_key = OPENAI_API_KEY


def tts_to_audio_file(text, audio_filename):
    tts = gTTS(text, lang="en")
    tts.save(audio_filename)


def download_image(image_url):
    response = requests.get(image_url)
    response.raise_for_status()
    return Image.open(BytesIO(response.content))


def generate_summary(text):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": f"""
Please summarize the following text into 40 words or so:

Text:

{text}

Be concise, only reply with the summary, say nothing else.
""",
            }
        ],
    )
    return response.choices[0].message["content"].strip()


def create_video_from_images(images_text, output_filename):
    clips = []

    for index, (image_url, text) in enumerate(images_text):
        audio_filename = f"audio_{index}.mp3"
        summary = generate_summary(text)
        print(summary)
        tts_to_audio_file(summary, audio_filename)

        image = download_image(image_url)
        image_np = np.array(image)
        audio_clip = AudioFileClip(audio_filename)
        speed_factor = 1.25

        audio_clip = vfx.speedx(audio_clip, speed_factor)

        image_clip = ImageClip(image_np, duration=audio_clip.duration)
        image_clip = image_clip.set_audio(audio_clip)

        clips.append(image_clip)

    final_clip = concatenate_videoclips(clips)
    final_clip.fps = 24
    final_clip.write_videofile(output_filename, codec="libx264", audio_codec="aac")


if __name__ == "__main__":
    images_text = [
        (
            "https://oaidalleapiprodscus.blob.core.windows.net/private/org-affWKA45gWrcD0xyhJJp9qeE/user-R1ht7HU98Wx51QfyGJjyhovm/img-qa5KwJjnJc9KWLylCBHHMn7G.png?st=2023-04-14T09%3A48%3A07Z&se=2023-04-14T11%3A48%3A07Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-13T17%3A15%3A07Z&ske=2023-04-14T17%3A15%3A07Z&sks=b&skv=2021-08-06&sig=M/yAo/K%2B2O7%2B1YKOfy6HI9FDf9sTScTiRrlCiJBYBwg%3D",
            """
            In the futuristic megacity of New Delhi-94, the sprawling capital of India, the year is 2121. The city is filled with neon lights, colossal skyscrapers, and flying vehicles zipping through the air. People from all walks of life, including humans, cyborgs, and other species, live and work alongside each other. You are a seasoned agent working for the Inter-Species Detective Agency (ISDA), tasked with solving crimes which involve different species.

Recently, there has been a sudden surge in cyber attacks on key government infrastructure. It's suspected to be the work of a notorious group named "The Neoteric Collective", known for their advanced technology and disdain for the government's treatment of non-human species. As you sit down in your office at the ISDA headquarters, your personal AI assistant, EVE, informs you of an important new lead in the case.

"Agent, we have received an encrypted message, supposedly from an informant within The Neoteric Collective," EVE tells you in a hushed tone. "They've agreed to meet and provide critical information, but we must choose the location carefully. It's crucial that we maintain secrecy due to the highly sensitive nature of this case."
            """,
        ),
        # ("https://example.com/image2.png", "This is the second image."),
        # ("https://example.com/image3.png", "This is the third image."),
    ]

    output_filename = "output_video.mp4"
    create_video_from_images(images_text, output_filename)
