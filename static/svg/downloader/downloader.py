import httpx
from selectolax.parser import HTMLParser
import json
from urllib.request import urlretrieve
import os
import time




CLASS = "div.mw-filepage-resolutioninfo"
all_urls = {}


def get_urls():
    url = "https://commons.m.wikimedia.org/wiki/Category:SVG_chess_pieces"
    req = httpx.get(url)
    parser = HTMLParser(req.content)
    table = parser.css("table")[1]


def get_image_url(url):
    img_urls = {}
    req = httpx.get(url)
    parser = HTMLParser(req.content)
    div = parser.css(CLASS)[0]
    urls = div.css("a")
    for u in urls:
        img_urls[u.text().split()[0]] = u.attributes.get("href")
    return img_urls


with open("urls.json", "r") as f:
    urls = json.load(f)


#with open("urls2.json", "w") as f:
#   json.dump(all_urls, f, indent=2)

#for k, v in urls.items():
#    all_urls[k] = get_image_url(v)

with open("./urls2.json", "r") as f:
    all_urls = json.load(f)

def download_image(url, name):
    urlretrieve(url, filename=name)

for url in all_urls:
    for res in all_urls[url]:
        folder = res.replace(",", "")
        os.makedirs(folder, exist_ok=True)
        u = all_urls[url][res]
        name =f"{folder}/" + u.split("/")[-1]
        urlretrieve(u, name)
        print("downloading", name)
        time.sleep(1)



