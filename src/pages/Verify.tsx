import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, InputOnChangeData } from "semantic-ui-react";
import { RootState } from "../store";
import { authActions } from "../store/auth-slice";

const Verify = () => {
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState("");
  const user = useSelector((state: RootState) => state.auth);
  console.log(user);

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(localStorage.getItem("token"));

    axios
      .get(`http://localhost:5000/api/users/verify?code=${code}`, {
        headers: {
          authentication: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(({ data: { token, ...data } }) => {
        localStorage.setItem("token", data.token);
        dispatch(authActions.signin(data));
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          console.log(errors);
          setErrors(Object.values(errors as object)[0]);
        }
      );
  };
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    { name, value }: InputOnChangeData
  ) => {
    setCode(value);
    setErrors("");
  };
  return (
    <div className="Form">
      <h1>Verify User</h1>
      <Form onSubmit={handleVerify} noValidate>
        <Form.Input
          error={
            errors !== "" && {
              content: errors,
              pointing: "above",
            }
          }
          name="code"
          label="Code"
          type="text"
          placeholder="Enter Code sent to your Email"
          onChange={onChange}
          value={code}
        />

        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default Verify;
