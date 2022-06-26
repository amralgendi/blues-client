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
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(localStorage.getItem("token"));
    setLoading(true);
    axios
      .get(
        `https://floating-bayou-81904.herokuapp.com/api/users/verify?code=${code}`,
        {
          headers: {
            authentication: `Bearer ${user!.token}`,
          },
        }
      )
      .then(({ data: { token, ...data } }) => {
        localStorage.setItem("token-blues", data.token);
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
      )
      .finally(() => {
        setLoading(false);
      });
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
      <Form onSubmit={handleVerify} noValidate loading={loading}>
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
