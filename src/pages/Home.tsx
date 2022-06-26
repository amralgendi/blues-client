import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, Loader, SemanticWIDTHS } from "semantic-ui-react";
import { RootState } from "../store";
import { ITodoData } from "../interfaces/todos";
import TodoCard from "../components/TodoCard";
import { Link } from "react-router-dom";

const Home = () => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const [todos, setTodos] = useState<ITodoData[] | null>(null);
  const [columns, setColumns] = useState(1);
  const [loading, setLoading] = useState(true);
  const handleDelete = (id: string) => {
    console.log("deleting");

    const holdTodos = [...(todos as ITodoData[])];
    setTodos((oldTodos) => {
      (oldTodos as ITodoData[]).splice(
        (oldTodos as ITodoData[]).findIndex((todo) => todo._id === id),
        1
      );
      console.log(oldTodos);

      return [...(oldTodos as ITodoData[])];
    });
    axios
      .delete(`https://floating-bayou-81904.herokuapp.com/api/todos/${id}`, {
        headers: {
          authentication: `Bearer ${user!.token}`,
        },
      })
      .then(({ data: { success, message } }) => {
        console.log(message);
      })
      .catch((e) => setTodos(holdTodos));
  };

  useEffect(() => {
    console.log(user);

    if (isLoggedIn) {
      axios
        .get("https://floating-bayou-81904.herokuapp.com/api/todos", {
          headers: {
            authentication: `Bearer ${user!.token}`,
          },
        })
        .then(({ data: { data } }) => {
          setLoading(false);
          console.log(data);

          setTodos(data);
          console.log(data);
        })
        .catch((e) => console.log(e));
    }
  }, [isLoggedIn, user]);
  useEffect(() => {
    function checkSize() {
      const width = window.innerWidth;
      if (width > 900) setColumns(3);
      else if (width > 550) setColumns(2);
      else setColumns(1);
    }
    checkSize();
    window.onresize = checkSize;
  }, []);
  return (
    <>
      {isLoggedIn ? (
        <div className="grid-container">
          <Grid columns={columns as SemanticWIDTHS} stretched className="Grid">
            <Grid.Row centered>
              <h1>Todos</h1>
            </Grid.Row>
            {loading ? (
              <Grid.Row centered>
                <Loader />
              </Grid.Row>
            ) : (todos as ITodoData[]).length > 0 ? (
              (() => {
                if (!todos) return;
                const Rows: JSX.Element[] = [];
                for (let i = 0; i < todos.length; i += columns) {
                  const Columns: JSX.Element[] = [];
                  for (let j = i; j < i + columns && j < todos.length; j++) {
                    Columns.push(
                      <Grid.Column stretched>
                        {
                          <TodoCard
                            todo={todos[j]}
                            key={todos[j]._id}
                            handleDelete={handleDelete}
                          ></TodoCard>
                        }
                      </Grid.Column>
                    );
                  }
                  Rows.push(<Grid.Row centered>{Columns}</Grid.Row>);
                }
                return Rows;
              })()
            ) : (
              <Grid.Row centered className="font-full-row">
                U have no Todos... <Link to="/create-todo">Create one?</Link>
              </Grid.Row>
            )}
          </Grid>
        </div>
      ) : (
        <div className="font-full-screen">
          Welcome to Amr AlGendi's Todo App
        </div>
      )}
    </>
  );
};

export default Home;
