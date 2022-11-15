import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import { config } from "./config";

function Login() {
  const navigate = useNavigate();
  const loginform = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      // console.log(values)
      try {
        const user = await axios.post(`${config.api}/user/login`, values);
        localStorage.setItem("myreact",user.data.token)
        if (user.data.message === "Success") {
          navigate("/product");
        }
      } catch (error) {
        alert(error.response.data.message);
      }
    },
  });
  return (
    <div className="container">
      <form onSubmit={loginform.handleSubmit}>
        <div className="row">
          <div className="col-lg-12 form-group">
            <label>E-mail</label>
            <input
              name="email"
              onChange={loginform.handleChange}
              value={loginform.values.email}
              className="form-control"
              type={"email"}
            />
          </div>
          <div className="col-lg-12 form-group">
            <label>Password</label>
            <input
              name="password"
              onChange={loginform.handleChange}
              value={loginform.values.password}
              className="form-control"
              type={"password"}
            />
          </div>
          <div className="col-lg-12 form-group mt-2">
            <input className="btn btn-primary" type={"submit"} />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
