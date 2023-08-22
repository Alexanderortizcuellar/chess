import chess


def pgn_parser(coords):
    pgn = []
    coords_list = coords.split(" ")
    board = chess.Board()
    counter = 0
    move_number = 1
    pair = []
    for coord in coords_list:
        print(coord, counter)
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
    return pgn

moves = "f2f4 g8f6 b2b3 d7d5 c1b2 b8c6 e2e3 c8g4 f1e2 g4e2 g1e2 e7e6 e1g1 f8c5 d2d4 c5d6 b1d2 e8g8 h2h3 f8e8"
pgn = pgn_parser(moves)
print(pgn)


