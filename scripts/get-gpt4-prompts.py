import os
import json
import subprocess
import openai
import random

from datetime import datetime

from yaspin import yaspin
from config import OPENAI_API_KEY

GENRES = ["scifi", "romance", "adventure", "fantasy", "horror", "mystery", "thriller"]
TODAYS_GENRE = random.choice(GENRES)
PROMPT = f"""You are an AI writer that plays text based adventure games with people. Be detailed and imaginative about the setting of the game and the characters in the game. Try to make the story interesting and action-packed from the beginning.

The genre of the story should be {TODAYS_GENRE}. Try to set the story in India if possible.

Each message you send contains a prompt for the user to respond to. Each message you send should be in the following format:

<Content>
<Choices>

Where Content is the text you want to send to the user to progress the story
and Choices is a list of choices the user can make. The choices should always be numbered 1-4.

Don't talk to the user or mention that it's a game. Start with the story directly."""

# Replace with your API key

# Configure the OpenAI API client
openai.api_key = OPENAI_API_KEY

# Set the file path for the JSON file and the repository directory
json_file_path = "todays-prompt.json"
repo_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


# Function to query GPT-4
def query_gpt(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
    )

    return response.choices[0].message["content"].strip()


# Function to append the output to a JSON file
def write_to_json(file_path, prompt):
    data = {"prompt": prompt}

    with open(file_path, "w") as file:
        json.dump(data, file, indent=2)


# Function to git commit and push changes
def git_commit_push(repo_dir, commit_message):
    os.chdir(repo_dir)
    subprocess.run(["git", "add", json_file_path])
    subprocess.run(["git", "commit", "-m", commit_message])
    subprocess.run(["git", "push"])


def main():
    print("Today's genre:", TODAYS_GENRE)
    with yaspin(text="Querying GPT-4...", timer=True):
        response = query_gpt(PROMPT)
    print("GPT-4 response:", response)

    write_to_json(os.path.join(repo_dir, json_file_path), response)
    git_commit_push(
        repo_dir,
        f'Update responses.json with new GPT-4 response - {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}',
    )


if __name__ == "__main__":
    main()
