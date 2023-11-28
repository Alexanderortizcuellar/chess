package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/notnil/chess"
	"github.com/notnil/chess/uci"
)

func main() {
	if len(os.Args) == 2 {
		moves := os.Args[1]
		ParseMoves(moves)
		return
	}
	engine := os.Args[1]
	fenstr := os.Args[2]
	depth, _ := strconv.Atoi(os.Args[3])
	eng, err := uci.New(engine)
	if err != nil {
		panic(err)
	}
	defer eng.Close()

	fen, _ := chess.FEN(fenstr)
	eng.Run(uci.CmdUCI, uci.CmdIsReady, uci.CmdUCINewGame)
	game := chess.NewGame(fen)
	cmdpos := uci.CmdPosition{Position: game.Position()}
	cmdgo := uci.CmdGo{Depth: depth}
	eng.Run(cmdpos, cmdgo)
	move := eng.SearchResults().BestMove
	fmt.Println(move)
}

func ParseMoves(pgn string) {
	game := chess.NewGame()
	for _, move := range strings.Split(pgn, " ") {
		game.MoveStr(move)
	}
	fmt.Println(game.String())
	fmt.Println(game.FEN())
}
