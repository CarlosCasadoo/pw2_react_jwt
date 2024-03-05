import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authCall } from "@/lib/api";
import errorMsg from "@/lib/errorMsg";

const roles = [
  { value: "admin", label: "Administrador" },
  { value: "moderator", label: "Moderador" },
  { value: "user", label: "Usuario" },
];

export default function Register() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: [],
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    if (name === "roles") {
      if (!formData.roles.includes(value)) {
        setFormData((prevData) => ({
          ...prevData,
          roles: [...prevData.roles, value],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          roles: prevData.roles.filter((role) => role !== value),
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    Object.keys(formData).filter((key) => !formData[key]).forEach((key) => {
      errors[key] = errorMsg[key];
    });

    setFormErrors(errors);

    const errorHandler = (key, message) => {
        setFormErrors((prevErrors) => ({
          ...prevErrors, [key]: message,
        }));
    };

    if (Object.keys(errors).length === 0) {

      const response = await authCall('/api/auth/signup', formData)

      if (response.code === 200) {
        navigate("/login");
      }

      if (response.code === 503) {
        errorHandler("conn", "Error de conexión. Intente de nuevo más tarde.")
      }

      if (response.message.includes("Failed! Email is already in use!")) {
        errorHandler("email", "Correo ya registrado.")
      }

      if (response.message.includes("Failed! Username is already in use!")) {
        errorHandler("username", "Nombre de usuario ya registrado.");
      }

      if (response.message.includes("Error! Invalid Email.")) {
        errorHandler("email", "Correo inválido.");
      }

      if (response.message.includes("Error! Password must be at least 6 characters.")) {
        errorHandler("password", "La contraseña debe tener al menos 6 caracteres.");
      }

      if (response.message.includes("Error! Passwords do not match.")) {
        errorHandler("confirmPassword", "Las contraseñas no coinciden.");
      }

    }

  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="mx-auto max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Registro</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Ingresa tu información para crear una cuenta
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">Nombre</Label>
              <Input
                name="firstName"
                id="first-name"
                placeholder="Lee"
                onChange={handleChange}
                required
                className={
                  formErrors.firstName ? "border-2 border-red-500" : ""
                }
              />
              {
                formErrors.firstName && (
                  <p className="text-red-500 text-sm">
                    {formErrors.firstName}
                  </p>
                )
              }
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Apellidos</Label>
              <Input
                name="lastName"
                id="last-name"
                placeholder="Robinson"
                onChange={handleChange}
                required
                className={formErrors.lastName ? "border-2 border-red-500" : ""}
              />
              {formErrors.lastName && (
                <p className="text-red-500 text-sm">
                  {formErrors.lastName}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              name="username"
              id="username"
              placeholder="leerobin"
              onChange={handleChange}
              required
              className={formErrors.username ? "border-2 border-red-500" : ""}
            />
            {
              formErrors.username && (
                <p className="text-red-500 text-sm">
                  {formErrors.username}
                </p>
              )
            }
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              name="email"
              id="email"
              placeholder="m@example.com"
              onChange={handleChange}
              required
              type="email"
              className={formErrors.email ? "border-2 border-red-500" : ""}
            />
            {
              formErrors.email && (
                <p className="text-red-500 text-sm">
                  {formErrors.email}
                </p>
              )
            }
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
            {
              formErrors.password && (
                <p className="text-red-500 text-sm">
                  {formErrors.password}
                </p>
              )
            }
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirma la contraseña</Label>
            <Input
              name="confirmPassword"
              id="confirm-password"
              onChange={handleChange}
              required
              type="password"
              className={
                formErrors.confirmPassword ? "border-2 border-red-500" : ""
              }
            />
            {
              formErrors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {formErrors.confirmPassword}
                </p>
              )
            }
          </div>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={`w-[200px] justify-between ${formErrors.roles ? "border-2 border-red-500" : ""
                  }`}
              >
                {value
                  ? roles.find((rol) => rol.value === value)?.label
                  : "Selecciona tu rol..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            {
              formErrors.roles && (
                <p className="text-red-500 text-sm">
                  {formErrors.roles}
                </p>
              )
            }
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Busca un rol..." />
                <CommandEmpty>No se ha encontrado ningún rol.</CommandEmpty>
                <CommandGroup>
                  {roles.map((rol) => (
                    <CommandItem
                      key={rol.value}
                      value={rol.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                        handleChange({
                          target: {
                            name: "roles",
                            value: currentValue === value ? "" : currentValue,
                          },
                        });
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === rol.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {rol.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          {
              formErrors.conn && (
                <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {formErrors.conn}
                </AlertDescription>
                </Alert>
              )
            }
          <Button className="w-full" type="submit" onClick={handleSubmit}>
            Registrarse
          </Button>
          <Button className="w-full" type="submit">
          <Link to="/login">¿Ya tienes una cuenta? Inicia sesion</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
