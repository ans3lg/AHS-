import { useState } from "react";
import { useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IMaskInput } from "react-imask";
import "./AuthForm.css";
import { GoogleLogin } from "@react-oauth/google";

const AuthForm = ({ type }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const passwordCriteria = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
    };
  }, [password]);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Минимум 8 символов");
    if (!/[A-Z]/.test(password)) errors.push("Хотя бы одна заглавная буква");
    if (!/[0-9]/.test(password)) errors.push("Хотя бы одна цифра");
    if (!/[a-z]/.test(password)) errors.push("Хотя бы одна строчная буква");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (type === "register") {
      const passwordErrors = validatePassword(password);
      if (passwordErrors.length > 0) {
        setErrorMessage("Пароль не соответствует требованиям");
        return;
      }
    }

    const url = `http://localhost:5000/api/auth/${type}`;
    const userData = { email, password };

    if (type === "register") {
      if (!agreement) {
        setErrorMessage("Вы должны согласиться на обработку данных!");
        return;
      }
      userData.name = name;
      userData.phone = phone.replace(/\D/g, "");
    }

    try {
      const { data } = await axios.post(url, userData);
      localStorage.setItem("token", data.token);

      if (type === "register") {
        navigate("/login"); // После регистрации переходим на страницу входа
      } else {
        navigate("/");
        window.location.reload(); // Обновляем страницу после входа
      }
    } catch (error) {
      const errorText =
        error.response?.data?.message ||
        "Ошибка авторизации. Проверьте данные.";
      setErrorMessage(errorText); // 👈 Устанавливаем сообщение об ошибке
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="registerContainer">
      <h2>{type === "register" ? "Регистрация" : "Вход"}</h2>
      <div className="registerForm">
        {type === "register" && (
          <>
            <div className="formGroup">
              <label htmlFor="name">Имя:</label>
              <input
                type="text"
                placeholder="Имя"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="phone">Номер телефона:</label>
              <IMaskInput
                mask="+7 (000) 000-00-00"
                value={phone}
                onAccept={(value) => setPhone(value)}
                placeholder="+7 (___) ___-__-__"
                required
              />
            </div>
          </>
        )}

        <div className="formGroup">
          <label htmlFor="email">Электронная почта:</label>
          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="formGroup passwordInput">
          <label htmlFor="password">Пароль:</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="togglePassword"
            onClick={togglePasswordVisibility}
          >
            <img
              src={showPassword ? "/eye-hide.png" : "/eye.png"}
              alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
            />
          </button>
        </div>

        {type === "register" && (
          <>
            <div className="formGroup passwordInput">
              <label htmlFor="confirmPassword">Подтверждение пароля:</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Подтвердите пароль"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="togglePassword"
                onClick={toggleConfirmPasswordVisibility}
              >
                <img
                  src={showConfirmPassword ? "/eye-hide.png" : "/eye.png"}
                  alt={
                    showConfirmPassword ? "Скрыть пароль" : "Показать пароль"
                  }
                />
              </button>
            </div>
            <div className="formGroup">
              <label>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={agreement}
                  onChange={(e) => setAgreement(e.target.checked)}
                />
                Я согласен на обработку данных
              </label>
            </div>
          </>
        )}
        {type === "register" && (
          <div className="password-hints">
            <p>Пароль должен содержать:</p>
            <ul>
              <li className={passwordCriteria.minLength ? "valid" : "invalid"}>
                Минимум 8 символов
              </li>
              <li
                className={passwordCriteria.hasUpperCase ? "valid" : "invalid"}
              >
                Хотя бы одну заглавную букву
              </li>
              <li
                className={passwordCriteria.hasLowerCase ? "valid" : "invalid"}
              >
                Хотя бы одну строчную букву
              </li>
              <li className={passwordCriteria.hasNumber ? "valid" : "invalid"}>
                Хотя бы одну цифру
              </li>
            </ul>
          </div>
        )}
        {errorMessage && (
          <div className="auth-error-message">{errorMessage}</div>
        )}
        <br />
        <div className="formGroup">
          <button type="submit" className="submitButton">
            {type === "register" ? "Зарегистрироваться" : "Войти"}
          </button>
        </div>
        <button
          className="google-login-button"
          onClick={() => {
            window.location.href = "http://localhost:5000/api/auth/google"; // ✅ Ведём на маршрут сервера
          }}
        >
          Войти через Google
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
