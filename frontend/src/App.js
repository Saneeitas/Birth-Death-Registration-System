import {useState} from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import classes from "./app.module.css";

const App = () => {
  const [todo, setTodo] = useState("");
  const [list, setList] = useState("");
  const url = "http://localhost:5000/todo";

  const submit = async (e) => {
    e.preventDefault();
    console.log(todo);

    await axios
      .post(`${url}/create`, todo)
      .then((res) => {
        const allProducts = res.data;
        console.log(allProducts);
      })
      .catch((error) => console.log(`Error: ${error}`));
  }
    return (
      <Container>
        <Typography variant="h6" component="h4" color="primary">
          CREATE TODO
        </Typography>
        <TextField
          className={classes.field}
          id="outlined-basic"
          label="Todo"
          variant="outlined"
          value={todo}
          onChange={(e)=> setTodo(e.target.value)}
        />
        <Button variant="contained" onClick={submit}>
          Add
        </Button>
      </Container>
    );
};

export default App;
