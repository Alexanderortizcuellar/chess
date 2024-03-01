import chess.pgn
import chess


with open("eco.pgn") as f:
    fens = []
    while True:
        try:
            game = chess.pgn.read_game(f)
            if game is None:
                break
            board = chess.Board()
            for move in game.mainline_moves():
                board.push(move)
            print(board.fen())
            fens.append(board.fen())
        except Exception as e:
            e.args
    with open("opening-fens.txt", "w") as f:
        for line in fens:
            f.write(line+"\n")
