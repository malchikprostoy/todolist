import React, { useContext } from "react";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";

import "./Form.scss";
import { CustomContext } from "../../utils/Context";

function Form() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, user } = useContext(CustomContext);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const registerUser = (data) => {
    axios
      .post("http://localhost:4000/register", {
        ...data,
        categories: [],
      })
      .then((res) => {
        setUser({
          token: res.data.accessToken,
          ...res.data.user,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: res.data.accessToken,
            ...res.data.user,
          })
        );
        reset();
        navigate("/");
      })
      .catch((err) => console.log(err));
  };
  const loginUser = (data) => {
    axios
      .post("http://localhost:4000/login", {
        ...data,
      })
      .then((res) => {
        setUser({
          token: res.data.accessToken,
          ...res.data.user,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: res.data.accessToken,
            ...res.data.user,
          })
        );
        reset();
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const onSubmit = (data) => {
    location.pathname === "/register" ? registerUser(data) : loginUser(data);
  };

  if(user.email.length !==0){
    return <Navigate to='/' />
  }
  return (
    <form noValidate className="form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="form__title">
        {location.pathname === "/register" ? "Регистрация" : "Вход"}
      </h2>
      {location.pathname === "/register" ? (
        <input
          {...register("login", {
            required: {
              message: "You need to fill login form",
              value: true,
            },
            maxLength: {
              message: "max 10 letters",
              value: 10,
            },
            minLength: {
              message: "min 3 letters",
              value: 3,
            },
          })}
          className="form__field"
          type="text"
          placeholder="Введите имя"
        />
      ) : (
        ""
      )}
      <p className="form__error"> {errors.login && errors.login.message} </p>
      <input
        {...register("email", {
          required: {
            message: "You need to fill login form",
            value: true,
          },
          maxLength: {
            message: "max 20 letters",
            value: 20,
          },
          minLength: {
            message: "min 3 letters",
            value: 3,
          },
          pattern: {
            message: "Напишите правильный email",
            value: /^[^]+@[^]+\.[a-z]{2,5}$/,
          },
        })}
        className="form__field"
        type="email"
        placeholder="Введите почту"
      />
      <p>{errors.email && errors.email.message}</p>
      <input
        {...register("password", {
          required: {
            message: "You need to fill login form",
            value: true,
          },
          maxLength: {
            message: "max 20 letters",
            value: 20,
          },
          minLength: {
            message: "min 3 letters",
            value: 3,
          },
          pattern: {
            message:
              "Пароль должен содержать не менее 3 символов, заглавную букву, число!",
            value:
              /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/g,
          },
        })}
        className="form__field"
        type="password"
        placeholder="Введите пароль"
      />
      <p className="form__error">
        {errors.password && errors.password.message}
      </p>
      <button type="sumbit" className="form__btn">
        {location.pathname === "/register" ? "Зарегистрироватся" : "Войти"}
      </button>
      <p className="form__text">
        {location.pathname === "/register" ? (
          <>
            У вас уже есть акаунт?
            <Link className="form__link" to="/login">
              Войти
            </Link>
          </>
        ) : (
          <>
            Если у вас нет аккаунта, пройдите
            <Link className="form__link" to="/register">
              регистрацию.
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

export default Form;
