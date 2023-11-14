package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/notnil/chess"
	"github.com/notnil/chess/uci"
)

func StartEngine(engine string) uci.Engine {
	eng, err := uci.New(engine)
	if err != nil {
		panic(err)
	}
	return *eng
}

func GetMove(c *gin.Context) {
	board := chess.NewGame()
	fmt.Println(board.FEN())
	c.JSON(http.StatusOK, gin.H{"move": board.FEN()})
}

func main() {
	router := gin.Default()
	router.GET("/move", GetMove)
	router.Run()
}
