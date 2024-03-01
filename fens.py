import sqlite3


with open("opening-fens.txt") as f:
    fens = f.readlines()

fens = [[fen.strip("\n")] for fen in fens]
con = sqlite3.connect("fens.db")
cursor = con.cursor()
q = "insert into fens values(?)"
cursor.executemany(q, fens)
print(fens[0:10])

con.commit()
con.close()
