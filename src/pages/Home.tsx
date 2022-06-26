import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid, SemanticWIDTHS } from "semantic-ui-react";
import { RootState } from "../store";
import { ITodoData } from "../interfaces/todos";
import TodoCard from "../components/TodoCard";
import { Link } from "react-router-dom";

const Home = () => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [todos, setTodos] = useState<ITodoData[] | null>(null);
  const [columns, setColumns] = useState(1);
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
      .delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          authentication: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data: { success, message } }) => {
        console.log(message);
      })
      .catch((e) => setTodos(holdTodos));
  };

  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get("http://localhost:5000/api/todos", {
          headers: {
            authentication: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(({ data: { data } }) => {
          console.log(data);

          setTodos(data);
          console.log(data);
        })
        .catch((e) => console.log(e));
    }
  }, [isLoggedIn]);
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
        todos && (todos as ITodoData[]).length > 0 ? (
          <div className="grid-container">
            <Grid
              columns={columns as SemanticWIDTHS}
              stretched
              className="Grid"
            >
              <Grid.Row centered>
                <h1>Todos</h1>
              </Grid.Row>
              {(() => {
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
              })()}
            </Grid>
          </div>
        ) : (
          <div>
            U have no Todos... <Link to="/create-todo">Create one?</Link>
          </div>
        )
      ) : (
        <>Welcome</>
      )}
    </>
  );
};

export default Home;
