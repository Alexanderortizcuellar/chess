import itertools
import string
import subprocess
import os
from flask import Flask, jsonify, render_template, request
import chess
import chess.pgn
import httpx
import sqlite3
import datetime
import random
from io import StringIO


app = Flask(__name__)

user = "Alexander"
process = subprocess.Popen("lila-gif")


def opening_explorer(fen):
    fen = fen.replace(" ", "%20")
    url = f"https://explorer.lichess.ovh/lichess?fen={fen}"
    print(url)
    response = httpx.get(url)
    print(response.content)


def create_all():
    con = sqlite3.connect("games.db")
    query = """
    create table if not exists games(
        date text,
        white text,
        black text,
        pgn text,
        fen text
    )
    """
    cursor = con.cursor()
    cursor.execute(query)
    con.commit()
    cursor.close()
    con.close()


create_all()


def save_game(white, black, pgn, fen):
    date = datetime.date.today()
    con = sqlite3.connect("games.db")
    cursor = con.cursor()
    query = """
    INSERT INTO games VALUES(?,?,?,?,?)
    """
    cursor.execute(query,
                   (date, white,
                    black, pgn, fen))
    con.commit()
    cursor.close()
    con.close()


def read_games():
    games = []
    create_all()
    con = sqlite3.connect("games.db")
    cursor = con.cursor()
    query = """
    SELECT
        rowid,date,white,black,pgn,fen
    FROM games
    """
    cursor.execute(query)
    data = cursor.fetchall()
    for game in data:
        games.append(list(game))
    return games


def add_state(board: list, quality):
    letters = string.ascii_lowercase
    path = "/static/svg/"
    q = quality
    board_chess = {
        "a1": f"{path}{q}/rook_white.png",
        "b1": f"{path}{q}/knight_white.png",
        "c1": f"{path}{q}/bishop_white.png",
        "d1": f"{path}{q}/queen_white.png",
        "e1": f"{path}{q}/king_white.png",
        "f1": f"{path}{q}/bishop_white.png",
        "g1": f"{path}{q}/knight_white.png",
        "h1": f"{path}{q}/rook_white.png",
    }

    for i, v in enumerate(list(board_chess.values())):
        coord = f"{letters[i]}8"
        board_chess[coord] = v.replace("white", "black")

    pawns = {
        f"{letters[p]}2": "/static/svg/2048/pawn_white.png"
        for p in range(8)
    }
    pawns_black = {
        f"{letters[p]}7": "/static/svg/2048/pawn_black.png"
        for p in range(8)
    }
    board_chess = board_chess | pawns | pawns_black

    for row in range(8):
        for col in range(8):
            board[row][col][2] = board_chess.get(board[row][col][1], "")
    return board


def create_board(initial=True, quality=2048):
    letters = string.ascii_lowercase
    cols = ["even", "odd"]
    cycle = itertools.cycle(cols)
    board = []
    for x in range(8):
        row = []
        for y in range(8):
            row.append([
                next(cycle), f"{letters[y]}{8-x}", ""
            ])
        board.append(row)
        cols = list(reversed(cols))
        cycle = itertools.cycle(cols)
    if initial:
        board = add_state(board, quality)
        board = [element for sublist in board for element in sublist]
    return board


# to swap the board with reverse the list # as the board changes coords but the
# colors are the same.
def swap_board(board: list):
    reversed_board = reversed(board)
    return reversed_board


def get_promotions(board: list[list]):
    promotions = {}
    for color in ["white", "black"]:
        promotions[color[0]] = color_solver_prom(color, board)
    print(promotions)
    return promotions


def color_solver_prom(color, board):
    urls = []
    patterns = []
    pieces = ["rook", "bishop",
              "queen", "knight"]
    for piece in pieces:
        patterns.append(f"{piece}_{color}")
    for row in board:
        if contains(patterns, row[2]):
            urls.append(row[2])
    return list(set(urls))


def contains(patterns, row):
    for pattern in patterns:
        if pattern in row:
            return True
    return False


def fen_to_board(fen: str, quality=2048):
    fen_board = []
    parts = fen.split(" ", 1)
    board_part = parts[0]
    rows = board_part.split("/")
    for row in rows:
        new_row = expand_row(row)
        fen_board.append(new_row)
    board = create_board(False, quality)
    for row, rowfen in zip(board, fen_board):
        for col, colfen in zip(row, rowfen):
            col[2] = colfen
    maps = create_mappings(quality)
    for row in board:
        for col in row:
            col[2] = maps.get(col[2], "")
    board = [element for sublist in board for element in sublist]
    return board


def create_mappings(quality):
    path = f"static/svg/{quality}/"
    pieces = os.listdir(path)
    maps = {}
    for piece in pieces:
        p = ""
        if "white" in piece:
            if "knight" in piece:
                p = "N"
            else:
                p = piece[0].upper()
        if "black" in piece:
            if "knight" in piece:
                p = "n"
            else:
                p = piece[0]
        maps[p] = "/" + path + piece
    return maps


def expand_row(row: str):
    new_row = []
    for item in list(row):
        if item.isdigit():
            for _ in range(int(item)):
                new_row.append("")
        else:
            new_row.append(item)
    return new_row


def fen_to_image(fen):
    path = "static/image.gif"
    fen = fen.split(" ")[0]
    url = f"http://localhost:6175/image.gif?fen={fen}"
    response = httpx.get(url)
    with open(path, "wb") as f:
        f.write(response.content)


def get_first_move():
    moves = ['e2e4', 'd2d4', 'g1f3',
             'c2c4', 'e2e3', 'f2f4',
             'b1c3', "g1g2"]
    random.shuffle(moves)
    return random.choice(moves)


def game_results(pgn, color):
    blue = "rgba(0,0,255, 0.6)"
    red = "rgba(255,0,0,0.6)"
    pgn = StringIO(pgn)
    game = chess.pgn.read_game(pgn)
    board = game.board()  # pyright: ignore
    for move in game.mainline_moves():  # pyright:ignore
        board.push(move)
    if board.is_checkmate():
        if color == "white":
            if board.result() == "1-0":
                return "Checkmate", "seagreen"
            else:
                return "Checkmate", red
        if color == "black":
            if board.result() == "0-1":
                return "Checkmate", "seagreen"
            else:
                return "Checkmate", red

    if board.is_stalemate():
        return "Stalemate", blue
    if "/" in board.result():
        return "Draw", blue
    if not board.is_game_over():
        return "Not finished", blue
    if "/" not in board.result():
        pass
    return "", ""


# routes start here
@app.route("/")
def home():
    board = create_board()
    proms = get_promotions(board)
    t = render_template("main.html", sqs=board, proms=proms)
    return t


# endpoint that sends back whatever it receives
@app.route("/send", methods=["POST"])
def send():
    if request.method == "POST":
        data = request.get_json().get("datos")
        return jsonify({"data": data})
    return jsonify("nothing")


@app.route("/check", methods=["POST"])
def check():
    fen = request.get_json().get("fen")
    moves = list(chess.Board(fen).generate_legal_moves())
    moves = [move.uci()
             for move in moves]
    return jsonify({"data": moves})


@app.route("/newgame", methods=["POST"])
def new_game():
    fen = request.get_json().get("fen")
    board = fen_to_board(fen)
    t = render_template("board.html", board=board)
    return jsonify({"data": t})


@app.route("/eval", methods=["POST"])
def get_engine_move():
    fen = request.get_json().get("fen")
    if fen == chess.Board().fen():
        move = get_first_move()
        return jsonify({"data": move})
    engine = request.get_json().get("engine")
    depth = random.randint(2, 4)
    command = ["./eval", engine, fen, str(depth)]
    out = subprocess.run(
            command,
            capture_output=True
        )
    move = out.stdout.decode("utf-8").replace("\n", "")
    # opening_explorer(fen)
    print(move, out.stderr)
    return jsonify({"data": move})


@app.route("/swap", methods=["POST"])
def swap():
    fen = request.get_json().get("fen")
    white_first = request.get_json().get("whitefirst")
    board = fen_to_board(fen)
    if not white_first:
        board = swap_board(board)
    t = render_template(
            "board.html",
            board=board)
    return jsonify({"data": t})


@app.route("/pgn", methods=["POST"])
def pgn_parser():
    pgn = []
    coords: str = request.get_json().get("coords")
    print(coords)
    fenstr = request.get_json().get("fen")
    coords = coords.rstrip(" ")
    coords_list = coords.split(" ")
    board = chess.Board()
    if fenstr is not None:
        board = chess.Board(fenstr)
    counter = 0
    move_number = 1
    pair = []
    for coord in coords_list:
        m = chess.Move.from_uci(coord)
        move = board.san(m)
        board.push(m)
        pair.append(move)
        if counter % 2 != 0:
            pgn_move = f"{move_number}. "+" ".join(pair)
            pgn.append(pgn_move)
            move_number += 1
            counter = 0
            pair = []
        else:
            counter += 1
    print(pgn)
    return jsonify({"pgn": pgn, "fen": board.fen()})


@app.route("/import-pgn", methods=["GET"])
def import_pgn():
    return render_template("importpgn.html")


@app.route("/import-fen", methods=["POST"])
def import_fen():
    fen = request.get_json().get("fen")
    board = fen_to_board(fen)
    t = render_template(
            "index.html",
            board=board)
    return jsonify({"data": t})


@app.route("/download", methods=["POST"])
def download_image():
    fen = request.get_json().get("fen")
    fen_to_image(fen)
    return jsonify({"data": "200"})


@app.route("/save", methods=["POST"])
def save_games():
    data = request.get_json()
    white = data.get("white")
    black = data.get("black")
    pgn = data.get("pgn")
    game = chess.pgn.read_game(StringIO(pgn))
    board = game.board()  # pyright:ignore
    for move in game.mainline_moves():  # pyright: ignore
        board.push(move)
    fen = board.fen()
    board.is_checkmate()
    board.outcome()
    save_game(white, black,
              pgn, fen)
    print(data)
    return jsonify({"data": "successful"})


@app.route("/games", methods=["GET"])
def show_games():
    games = []
    data = read_games()
    for game in data:
        game_dict = {}
        board = fen_to_board(game[-1], 64)
        game_dict["board"] = board
        game_dict["white"] = game[2].title()
        game_dict["black"] = game[3].title()
        game_dict["date"] = game[1]
        if game[2] == user:
            side = "white"
        else:
            side = "black"
        print(side, game[2])
        result, color = game_results(game[-2], side)
        game_dict["result"] = result
        game_dict["color"] = color
        games.append(game_dict)
    templ = render_template(
            "games.html", games=games,
            number=f"{len(games)} ")
    return templ


@app.route("/coordinates")
def go_to_coords():
    fen = chess.Board().fen()
    board = fen_to_board(fen, 1024)
    templ = render_template(
            "coordinates.html",
            board=board)
    return templ


@app.route("/blind-chess")
def blind_css():
    fen = chess.Board().fen()
    board = fen_to_board(fen, 1024)
    templ = render_template(
            "blind.html",
            board=board)
    return templ


@app.route("/board-memorization")
def go_to_memorization():
    templ = render_template(
            "memorization.html")
    return templ
