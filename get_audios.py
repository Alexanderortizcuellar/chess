import httpx
from selectolax.parser import HTMLParser
import json


def get_name(url):
    name = url.split("/")[-1]
    return name


def download_audio(url):
    binary = httpx.get(url)
    name = get_name(url)
    with open(name, "wb") as f:
        f.write(binary.content)


def load_urls():
    with open("urls.json") as f:
        data = json.load(f)
        return data


def get_mp3_url(url):
    resp = httpx.get(url)
    parser = HTMLParser(resp.content)
    audio = parser.css_first("audio")
    if audio is not None:
        source = audio.css_first("source")
        return source.attributes.get("src")


def main():
    data = load_urls()
    for url in data:
        mp3url = get_mp3_url(url)
        print(mp3url)
        download_audio(mp3url)
        break


if __name__ == "__main__":
    main()
