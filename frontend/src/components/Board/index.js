import React, { useEffect, useState } from "react";
import { Grid, Fab, Card, Typography } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import BoardCell from "./BoardCell";
import { boardApi } from "../../services";

function Board() {
  const classes = useStyles();
  const [boards, setBoards] = useState([]);

  const fetchData = async () => {
    const boards = await boardApi.getBoards();
    setBoards(boards);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.header}>
        Public board
      </Typography>
      <Grid container justify="left" spacing={5}>
        <Grid key="add-board-button" item>
          <Card className={classes.AddBoardBtn}>
            <Fab color="secondary">
              <AddIcon />
            </Fab>
            <Typography variant="subtitle2" color="secondary" style={{ marginTop: 10 }}>
              Add board
            </Typography>
          </Card>
        </Grid>
        {boards.map((value, i) => (
          <BoardCell key={i} value={value} />
        ))}
      </Grid>
    </div>
  );
}

export default Board;

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    marginTop: 20,
    margin: "auto",
    width: "90%",
  },
  header: {
    marginBottom: 20,
    color: "#283593",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  AddBoardBtn: {
    cursor: "pointer",
    padding: "20px 40px",
    background: "transparent",
    border: "2px #ccc dashed",
    boxShadow: "none",
    textAlign: "center",
    "&:hover": {
      border: "2px #C51162 dashed",
    },
  },
});