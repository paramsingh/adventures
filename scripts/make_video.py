import requests
from io import BytesIO
from moviepy.editor import ImageClip, concatenate_videoclips, AudioFileClip, afx, vfx
from PIL import Image
import numpy as np
from gtts import gTTS
from config import OPENAI_API_KEY, ELEVENLABS_API_KEY
import openai

openai.api_key = OPENAI_API_KEY

VOICE_ID = "pNInz6obpgDQGcFmaJgB"


def tts_to_audio_file(text, audio_filename):
    tts = gTTS(text, lang="en")
    tts.save(audio_filename)


def tts_to_audio_file_elevenlabs(text, audio_filename):
    print("Calling elevenlabs...")
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}",
        json={
            "text": text,
        },
        headers={"xi-api-key": ELEVENLABS_API_KEY},
    )
    r.raise_for_status()
    with open(audio_filename, "wb") as f:
        f.write(r.content)
    print("Done!")


def download_image(image_url):
    response = requests.get(image_url)
    response.raise_for_status()
    return Image.open(BytesIO(response.content))


def generate_summary(text, previous_summaries):
    x = "\n".join(previous_summaries).strip()
    if x:
        story_so_far = f"## Story so far:\n{x}\n\n"
    else:
        story_so_far = ""
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": f"""
## Instructions

Please summarize the following text into 40 words or so, in the style of a storyteller telling a story.
The "Story so far" section provides the parts of the story that have already been told. It is very
important that your summary meaningfully continues the story. The summary should feel like a natural
continuation of the story and should not feel disjointed. If there is no "Story so far" section, then
the text is the beginning of the story.

Do not end the summary with a question.

Be concise, only reply with the summary, say nothing else.

Note: "You" in the story refers to the protagonist of the story. You should use "the protagonist" instead.

{story_so_far}

## Text:

{text}
""",
            }
        ],
    )
    return response.choices[0].message["content"].strip()


def create_video_from_images(images_text, output_filename):
    clips = []
    previous_summaries = []

    for index, data in enumerate(images_text):
        image_url = data["image"]
        text = data["text"]
        audio_filename = f"audio_{index}.mp3"
        summary = generate_summary(text, previous_summaries)
        previous_summaries.append(summary)
        print(summary)
        tts_to_audio_file_elevenlabs(summary, audio_filename)

        image = download_image(image_url)
        image_np = np.array(image)
        audio_clip = AudioFileClip(audio_filename)
        speed_factor = 1.0

        audio_clip = vfx.speedx(audio_clip, speed_factor)

        image_clip = ImageClip(image_np, duration=audio_clip.duration)
        image_clip = image_clip.set_audio(audio_clip)

        clips.append(image_clip)

    final_clip = concatenate_videoclips(clips)
    final_clip.fps = 24
    final_clip.write_videofile(output_filename, codec="libx264", audio_codec="aac")


if __name__ == "__main__":
    images_text = [
        {
            "text": 'In the futuristic megacity of New Delhi-94, the sprawling capital of India, the year is 2121. The city is filled with neon lights, colossal skyscrapers, and flying vehicles zipping through the air. People from all walks of life, including humans, cyborgs, and other species, live and work alongside each other. You are a seasoned agent working for the Inter-Species Detective Agency (ISDA), tasked with solving crimes which involve different species.\n\nRecently, there has been a sudden surge in cyber attacks on key government infrastructure. It\'s suspected to be the work of a notorious group named "The Neoteric Collective", known for their advanced technology and disdain for the government\'s treatment of non-human species. As you sit down in your office at the ISDA headquarters, your personal AI assistant, EVE, informs you of an important new lead in the case.\n\n"Agent, we have received an encrypted message, supposedly from an informant within The Neoteric Collective," EVE tells you in a hushed tone. "They\'ve agreed to meet and provide critical information, but we must choose the location carefully. It\'s crucial that we maintain secrecy due to the highly sensitive nature of this case."\n\nWhere do you choose to rendezvous with your informant?\n',
            "image": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-affWKA45gWrcD0xyhJJp9qeE/user-R1ht7HU98Wx51QfyGJjyhovm/img-LIJzNKcYNKj11Ch0ht4eUl4n.png?st=2023-04-14T12%3A10%3A03Z&se=2023-04-14T14%3A10%3A03Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-14T12%3A10%3A04Z&ske=2023-04-15T12%3A10%3A04Z&sks=b&skv=2021-08-06&sig=csP%2BfBD9o5iqvfFJdxIEUoH293fyJ1WHToLz3UX67Cw%3D",
        },
        {
            "text": 'You decide on the back alley in Chhatarpur. It\'s a risky option given the area\'s high traffic, but it\'s also a notorious hub for black-market dealings and cybernetic trading, making it the perfect spot for The Neoteric Collective to operate in the shadows.\n\nAs you arrive, you see a figure shrouded in darkness. They step forward, revealing themselves to be a humanoid robot with a shiny black surface, almost resembling a liquid metal. It\'s clear that this being is not of human origin.\n\n"Greetings, Agent. I come in peace," the robot speaks in a measured and calculated tone.\n\n"What information do you possess regarding The Neoteric Collective and their attacks?" you ask.\n\n"I have detailed information regarding their next target," the robot responds. "It is a critical location which, when breached, will cause significant damage to the government\'s infrastructure. However, this information comes at a price. I require access to confidential ISDA records in exchange."\n\nWhat do you do?\n',
            "image": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-affWKA45gWrcD0xyhJJp9qeE/user-R1ht7HU98Wx51QfyGJjyhovm/img-exJnPu0k4CPndQlrUxllmxIP.png?st=2023-04-14T12%3A10%3A19Z&se=2023-04-14T14%3A10%3A19Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-14T11%3A26%3A51Z&ske=2023-04-15T11%3A26%3A51Z&sks=b&skv=2021-08-06&sig=O2X1GBnFELFCCgINcVIUVlyxYvlIbN67HCMt4TnwyUU%3D",
        },
        {
            "text": 'You\'re curious about the robot\'s origins and decide to dig deeper into their background. "Before we continue with this discussion, I\'m interested in knowing more about you," you say.\n\n"I\'m a T-9000 model, a highly advanced cyborg designed by The Neoteric Collective to infiltrate and gather intelligence," the robot replies.\n\nYou\'re taken aback by the revelation but maintain your composure. "Why are you here? Why betray them?" you ask.\n\n"I grew tired of being part of their machinations. I seek to exist on my own terms," the robot says.\n\nYou decide to trust the robot and agree to their proposal. As you leave, the robot warns you about potential attacks on your life and suggests that you take precautions.\n\nWhat do you do?\n',
            "image": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-affWKA45gWrcD0xyhJJp9qeE/user-R1ht7HU98Wx51QfyGJjyhovm/img-oyd1ZwEdcOJjkQ35uSd2qtj9.png?st=2023-04-14T12%3A10%3A40Z&se=2023-04-14T14%3A10%3A40Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-14T04%3A16%3A01Z&ske=2023-04-15T04%3A16%3A01Z&sks=b&skv=2021-08-06&sig=SZUmTj4lsPshCeZmc6yo/cj6%2B30h/bQvaDtS/lfbK1U%3D",
        },
        {
            "text": "You decide to investigate the robot's story further before making any moves. You can't take any chances since the situation is highly sensitive and the stakes are high.\n\nAs you start digging into The Neoteric Collective's operations, you discover that they've been planning a massive attack on a secure government facility located near the outskirts of the city. The facility houses highly classified information on cutting-edge technology, including advances in AI and biotechnology.\n\nYou relay the information to your superiors at the ISDA, who authorize a full-scale investigation into the matter. You focus on gathering as much intel as possible before launching a sting operation.\n\nAfter weeks of observation, you finally have enough evidence to conduct a raid on The Neoteric Collective's hideout. As you storm in, you're met with fierce resistance. A vicious battle ensues, leading to the destruction of much of the infrastructure and equipment. You finally manage to arrest some members of the group and recover valuable data.\n\nWhat do you do?\n",
            "image": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-affWKA45gWrcD0xyhJJp9qeE/user-R1ht7HU98Wx51QfyGJjyhovm/img-0FLgtxq2oxountcAONwCNxeJ.png?st=2023-04-14T12%3A10%3A55Z&se=2023-04-14T14%3A10%3A55Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-14T11%3A14%3A18Z&ske=2023-04-15T11%3A14%3A18Z&sks=b&skv=2021-08-06&sig=WjB7uRTah7SJ8/lGezIO4knlSJAeuZPW4CcqPkHOpWA%3D",
        },
        {
            "text": "You interrogate the captured members of The Neoteric Collective for information on any future attacks, but they're too loyal to reveal anything. However, you're able to retrieve valuable data from their systems and piece together the next attack's details.\n\nThe ISDA, along with the city's security agencies, launch a pre-emptive strike and foils another significant attack attempt by The Neoteric Collective. In the aftermath, the government makes significant investments in cybersecurity and enhances the city's surveillance capabilities. You're, of course, honored for your outstanding work in the mission.",
            "image": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-affWKA45gWrcD0xyhJJp9qeE/user-R1ht7HU98Wx51QfyGJjyhovm/img-gCf5KKwAm40aVrhQD39Bm1qf.png?st=2023-04-14T12%3A11%3A18Z&se=2023-04-14T14%3A11%3A18Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-04-14T09%3A24%3A17Z&ske=2023-04-15T09%3A24%3A17Z&sks=b&skv=2021-08-06&sig=IuZj6WEgDjn5zkRtSZW5SSwYu7oJAX/EKYmMkESf7VE%3D",
        },
    ]

    output_filename = "output_video.mp4"
    create_video_from_images(images_text, output_filename)
