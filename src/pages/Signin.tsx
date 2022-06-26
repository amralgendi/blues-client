import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, FormProps, InputOnChangeData } from "semantic-ui-react";
import { authActions } from "../store/auth-slice";

// interface ISigninInputs {
//   email: string;
//   password: string;
// }

const Signin = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  console.log(errors);

  const handleSignin = (
    e: React.FormEvent<HTMLFormElement>,
    data: FormProps
  ) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(
        "https://floating-bayou-81904.herokuapp.com/api/users/signin",
        values
      )
      .then(({ data: { data } }) => {
        console.log(data);

        localStorage.setItem("token", data.token);

        dispatch(authActions.signin(data));
        if (!data.verified) navigate("/verify");
        else navigate("/");
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          console.log(errors);
          setErrors((oldErrors) => ({ ...oldErrors, ...errors }));
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
    setValues((oldValues) => ({ ...oldValues, [name]: value }));
    setErrors((oldErrors) => ({ ...oldErrors, [name]: "" }));
  };
  return (
    <div className="Form">
      <h1>Signin</h1>
      <Form onSubmit={handleSignin} noValidate loading={loading}>
        <Form.Input
          error={
            errors.email !== "" && {
              content: errors.email,
              pointing: "above",
            }
          }
          name="email"
          label="Email"
          type="text"
          placeholder="Email"
          onChange={onChange}
          value={values.email}
        />
        <Form.Input
          error={
            errors.password !== "" && {
              content: errors.password,
              pointing: "above",
            }
          }
          name="password"
          label="Password"
          type="password"
          placeholder="8+ characters"
          onChange={onChange}
          value={values.password}
        />
        <Form.Field>
          <Link to="/forgot-password">forgot password?</Link>
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default Signin;
