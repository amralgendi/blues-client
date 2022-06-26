import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Checkbox,
  CheckboxProps,
  Dimmer,
  Grid,
  Label,
  Loader,
  Search,
  SearchProps,
  SemanticWIDTHS,
} from "semantic-ui-react";
import { RootState } from "../store";
import { ITodoData } from "../interfaces/todos";
import TodoCard from "../components/TodoCard";
import { Link } from "react-router-dom";

const Home = () => {
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const [todos, setTodos] = useState<ITodoData[] | null>(null);
  const [searchedTodos, setSearchedTodos] = useState<ITodoData[]>([]);
  const [columns, setColumns] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchValues, setSearchValues] = useState({
    searchBar: "",
    priority: ["Medium", "High", "Low"] as string[],
    status: ["In Progress", "Rework", "Completed", "Under Review"] as string[],
  });
  const handleSearchChange = (
    e: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLInputElement>,
    data: SearchProps | CheckboxProps
  ) => {
    if (data.name === "searchBar")
      setSearchValues((oldSearchValues) => ({
        ...oldSearchValues,
        [data.name]: data.value,
      }));
    else if (data.name === "priority" || "status") {
      if (data.checked)
        setSearchValues((oldSearchValues) => ({
          ...oldSearchValues,
          [data.name]: [
            ...oldSearchValues[data.name as "priority" | "status"],
            data.value,
          ],
        }));
      else
        setSearchValues((oldSearchValues) => {
          const index = oldSearchValues[
            data.name as "priority" | "status"
          ].findIndex((p) => p === data.value);

          if (index >= 0)
            oldSearchValues[data.name as "priority" | "status"].splice(
              index,
              1
            );
          return { ...oldSearchValues };
        });
    }
  };
  useEffect(() => {
    const searchTodos: ITodoData[] = [];
    if (todos) {
      for (let i = 0; i < todos.length; i++) {
        let isSearched: boolean = false;
        // if (
        //   todos[i].title.includes(searchValues.searchBar) ||
        //   todos[i].description.includes(searchValues.searchBar) ||
        //   searchValues.searchBar === ""
        // ) {
        //   console.log(
        //     todos[i].title.includes(searchValues.searchBar),
        //     todos[i].description.includes(searchValues.searchBar),
        //     searchValues.searchBar === ""
        //   );
        if (searchValues.searchBar === "") {
          isSearched = true;
          console.log(isSearched);
        } else if (
          todos[i].title.includes(searchValues.searchBar) ||
          todos[i].description.includes(searchValues.searchBar)
        ) {
          isSearched = true;
        }
        for (const p in searchValues.priority) {
          if (todos[i].priority === searchValues.priority[p] && isSearched) {
            searchTodos.push(todos[i]);
            break;
          }
        }
        for (const s in searchValues.status) {
          if (
            todos[i].status === searchValues.status[s] &&
            isSearched &&
            searchTodos.findIndex((t) => t._id === todos[i]._id) < 0
          ) {
            searchTodos.push(todos[i]);
            break;
          }
        }
      }
    }
    console.log(searchTodos);
    setSearchedTodos([...searchTodos]);
  }, [searchValues, todos]);

  const handleDelete = (id: string) => {
    console.log("deleting");

    const holdTodos = [...(todos as ITodoData[])];
    setTodos((oldTodos) => {
      const index = oldTodos!.findIndex((todo) => todo._id === id);
      if (index >= 0) (oldTodos as ITodoData[]).splice(index, 1);

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
          setSearchedTodos(data);
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
                <Grid.Column stretched>
                  <Dimmer active inverted>
                    <Loader size="small">Loading</Loader>
                  </Dimmer>
                </Grid.Column>
              </Grid.Row>
            ) : (todos as ITodoData[]).length > 0 ? (
              (() => {
                if (!todos) return;

                const Rows: JSX.Element[] = [];
                Rows.push(
                  <Grid.Row centered>
                    <Grid.Column
                      verticalAlign="middle"
                      style={{ margin: "3px" }}
                    >
                      <Search
                        name="searchBar"
                        placeholder="Search..."
                        onSearchChange={handleSearchChange}
                        showNoResults={false}
                        value={searchValues.searchBar}
                      />
                    </Grid.Column>
                    <Grid.Column width={5}>
                      <Label>Priority</Label>

                      <Checkbox
                        onChange={handleSearchChange}
                        checked={searchValues.priority.includes("High")}
                        name="priority"
                        label="High"
                        value="High"
                      />
                      <Checkbox
                        onChange={handleSearchChange}
                        checked={searchValues.priority.includes("Medium")}
                        name="priority"
                        label="Medium"
                        value="Medium"
                      />
                      <Checkbox
                        onChange={handleSearchChange}
                        name="priority"
                        label="Low"
                        checked={searchValues.priority.includes("Low")}
                        value="Low"
                      />
                    </Grid.Column>
                    <Grid.Column width={5}>
                      <Label>Status</Label>
                      <Checkbox
                        onChange={handleSearchChange}
                        name="status"
                        label="In Progress"
                        checked={searchValues.status.includes("In Progress")}
                        value="In Progress"
                      />
                      <Checkbox
                        onChange={handleSearchChange}
                        name="status"
                        label="Rework"
                        checked={searchValues.status.includes("Rework")}
                        value="Rework"
                      />

                      <Checkbox
                        onChange={handleSearchChange}
                        name="status"
                        label="Completed"
                        checked={searchValues.status.includes("Completed")}
                        value="Completed"
                      />
                      <Checkbox
                        onChange={handleSearchChange}
                        name="status"
                        label="Under Review"
                        checked={searchValues.status.includes("Under Review")}
                        value="Under Review"
                      />
                    </Grid.Column>
                  </Grid.Row>
                );
                if (searchedTodos.length < 1) {
                  Rows.push(
                    <Grid.Row centered>
                      <Grid.Column>
                        <div className="font-full-row">
                          No todos found for your search
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  );
                  return Rows;
                }
                for (let i = 0; i < searchedTodos.length; i += columns) {
                  const Columns: JSX.Element[] = [];
                  for (
                    let j = i;
                    j < i + columns && j < searchedTodos.length;
                    j++
                  ) {
                    Columns.push(
                      <Grid.Column stretched>
                        {
                          <TodoCard
                            todo={searchedTodos[j]}
                            key={searchedTodos[j]._id}
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
