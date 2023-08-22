import os

def fen_to_board(fen: str):
    board = []
    parts = fen.split(" ", 1)
    board_part = parts[0]
    rows = board_part.split("/")
    for row in rows:
        new_row = expand_row(row)
        board.append(new_row)


def expand_row(row: str):
    new_row = []
    for item in list(row):
        if item.isdigit():
            for _ in range(int(item)):
                new_row.append("")
        else:
            new_row.append(item)
    return new_row


def create_mappings():
    path = "static/svg/2048"
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
        maps[p] = piece
    print(maps)


fen = "r1b1kb1r/ppp1pppp/2n2n2/8/4P3/5P2/PPP3PP/RNBK1BNR w kq - 0 5"
# fen_to_board(fen)
create_mappings()
