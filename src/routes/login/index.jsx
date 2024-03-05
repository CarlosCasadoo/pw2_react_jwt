import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authCall } from "@/lib/api";
import errorMsg from "@/lib/errorMsg";

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = {};

    Object.keys(formData)
      .filter((key) => !formData[key])
      .forEach((key) => {
        errors[key] = errorMsg[key];
      });

    setFormErrors(errors);

    const errorHandler = (key, message) => {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [key]: message,
      }));
    };

    if (Object.keys(errors).length === 0) {
      const response = await authCall("/api/auth/signin", formData);

      switch (response.code) {
        case 404:
          errorHandler("badLogin", "Usuario o contraseña incorrectos.");
          break;
        case 503:
          errorHandler(
            "badLogin",
            "Error de conexión. Intente de nuevo más tarde."
          );
          break;
        default:
          navigate("/dashboard");
          break;
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Ingresa tu información para iniciar sesión.
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario o correo</Label>
            <Input
              name="username"
              id="username"
              onChange={handleChange}
              required
              className={formErrors.username ? "border-2 border-red-500" : ""}
            />
            {formErrors.username && (
              <p className="text-red-500 text-sm">{errorMsg.username}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              name="password"
              id="password"
              onChange={handleChange}
              required
              type="password"
              className={formErrors.password ? "border-2 border-red-500" : ""}
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm">{errorMsg.password}</p>
            )}
          </div>
          {formErrors.badLogin && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formErrors.badLogin}</AlertDescription>
            </Alert>
          )}
          <Button className="w-full" type="submit" onClick={handleSubmit}>
            Iniciar sesión
          </Button>
          <Button className="w-full" type="submit">
            <Link to="/register">¿Aún no tienes una cuenta? Regístrate</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
