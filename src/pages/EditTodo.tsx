import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  CheckboxProps,
  Form,
  InputOnChangeData,
} from "semantic-ui-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { authActions } from "../store/auth-slice";
import { useDispatch } from "react-redux";
type priorityEnum = "High" | "Medium" | "Low";
type statusEnum = "In Progress" | "Under Review" | "Rework" | "Completed";

interface ITodoData {
  title: string;
  description: string;
  priority: priorityEnum;
  status: statusEnum;
  startDate: string;
  endDate: string;
}

const EditTodo = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [values, setValues] = useState<ITodoData>({
    title: "",
    description: "",
    priority: "Low",
    status: "In Progress",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  console.log(values);

  const handleEditTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    axios
      .patch(
        "https://floating-bayou-81904.herokuapp.com/api/todos/" + id,
        {
          ...values,
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
        },
        {
          headers: {
            authentication: `Bearer ${user!.token}`,
          },
        }
      )
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        const {
          response: {
            data: { errors },
          },
        } = error;

        setErrors((oldErrors) => ({ ...oldErrors, ...errors }));
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    if (user && user.verified) {
      dispatch(authActions.signout());
      return;
    }
    console.log("sawsan");
    user &&
      axios
        .get(`https://floating-bayou-81904.herokuapp.com/api/todos/${id}`, {
          headers: {
            authentication: `Bearer ${user.token}`,
          },
        })
        .then(
          ({
            data: {
              data: {
                title,
                description,
                priority,
                status,
                startDate,
                endDate,
              },
            },
          }) => {
            setValues({
              title,
              description,
              priority,
              status,
              startDate: startDate.split("T")[0],
              endDate: endDate.split("T")[0],
            });
          }
        )
        .finally(() => setLoading(false));
  }, [id, user, dispatch]);
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>,
    { name, value }: InputOnChangeData | CheckboxProps
  ) => {
    setValues((oldValues) => ({ ...oldValues, [name]: value }));
    setErrors((oldErrors) => ({ ...oldErrors, [name]: "" }));
  };
  return (
    <div className="Form">
      <h1>Create Todo</h1>
      <Form onSubmit={handleEditTodo} noValidate loading={loading}>
        <Form.Input
          error={
            errors.title !== "" && {
              content: errors.title,
              pointing: "above",
            }
          }
          name="title"
          label="Title"
          type="text"
          placeholder="Enter Title"
          onChange={onChange}
          value={values.title}
        />
        <Form.Input
          error={
            errors.description !== "" && {
              content: errors.description,
              pointing: "above",
            }
          }
          name="description"
          label="Description"
          type="text"
          placeholder="Enter Description"
          onChange={onChange}
          value={values.description}
        />
        <Form.Group inline>
          <label>Priority</label>
          <Form.Radio
            name="priority"
            label="High"
            value="High"
            checked={values.priority === "High"}
            onChange={onChange}
          />
          <Form.Radio
            name="priority"
            label="Medium"
            value="Medium"
            checked={values.priority === "Medium"}
            onChange={onChange}
          />
          <Form.Radio
            name="priority"
            label="Low"
            value="Low"
            checked={values.priority === "Low"}
            onChange={onChange}
          />
        </Form.Group>
        <Form.Group inline>
          <label>Status</label>
          <Form.Radio
            name="status"
            label="In Progress"
            value="In Progress"
            checked={values.status === "In Progress"}
            onChange={onChange}
          />
          <Form.Radio
            name="status"
            label="Under Review"
            value="Under Review"
            checked={values.status === "Under Review"}
            onChange={onChange}
          />
          <Form.Radio
            name="status"
            label="Rework"
            value="Rework"
            checked={values.status === "Rework"}
            onChange={onChange}
          />
          <Form.Radio
            name="status"
            label="Completed"
            value="Completed"
            checked={values.status === "Completed"}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group widths="equal">
          <Form.Input
            fluid
            error={
              errors.startDate !== "" && {
                content: errors.startDate,
                pointing: "above",
              }
            }
            name="startDate"
            label="Start Date"
            type="date"
            onChange={onChange}
            value={values.startDate}
          />
          <Form.Input
            fluid
            error={
              errors.endDate !== "" && {
                content: errors.endDate,
                pointing: "above",
              }
            }
            name="endDate"
            label="End Date"
            type="date"
            onChange={onChange}
            value={values.endDate}
          />
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default EditTodo;
