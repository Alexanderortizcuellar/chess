import httpx
import chess
import json


def opening_explorer(fen):
    moves = []
    fen = fen.replace(" ", "%20")
    url = f"https://explorer.lichess.ovh/lichess?fen={fen}&moves=30"
    response = httpx.get(url)
    data = response.json()
    for move in data["moves"]:
        moves.append(move["uci"])
    print(moves)


fen = chess.Board().fen()
opening_explorer(fen)
