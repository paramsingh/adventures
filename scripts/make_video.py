import os
import requests
from io import BytesIO
from moviepy.editor import ImageClip, concatenate_videoclips, AudioFileClip
from PIL import Image
import pyttsx3


def tts_to_audio_file(text, audio_filename):
    engine = pyttsx3.init()
    engine.save_to_file(text, audio_filename)
    engine.runAndWait()


def download_image(image_url):
    response = requests.get(image_url)
    response.raise_for_status()
    return Image.open(BytesIO(response.content))


def create_video_from_images(images_text, output_filename):
    clips = []

    for index, (image_url, text) in enumerate(images_text):
        audio_filename = f"audio_{index}.mp3"
        tts_to_audio_file(text, audio_filename)

        image = download_image(image_url)
        audio_clip = AudioFileClip(audio_filename)
        image_clip = ImageClip(image, duration=audio_clip.duration)
        image_clip = image_clip.set_audio(audio_clip)

        clips.append(image_clip)

    final_clip = concatenate_videoclips(clips)
    final_clip.write_videofile(output_filename, codec="libx264", audio_codec="aac")


if __name__ == "__main__":
    images_text = [
        ("https://example.com/image1.png", "This is the first image."),
        ("https://example.com/image2.png", "This is the second image."),
        ("https://example.com/image3.png", "This is the third image."),
    ]

    output_filename = "output_video.mp4"
    create_video_from_images(images_text, output_filename)
