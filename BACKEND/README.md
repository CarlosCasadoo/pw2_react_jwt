
# Entrega 1

Para la realización de la primera entrega, se realizó con base al siguiente tutorial: [Node.js Express: JWT example | Token Based Authentication & Authorization](https://www.bezkoder.com/node-js-jwt-authentication-mysql/)

La estructura de archivos en cuanto a *backend* se refiere, es la siguiente:

```bash
.
├── config
│   ├── auth.config.js
│   └── db.config.js
├── controllers
│   ├── auth.controller.js
│   └── user.controller.js
├── middleware
│   ├── authJwt.js
│   ├── index.js
│   └── verifySignUp.js
├── models
│   ├── index.js
│   ├── role.model.js
│   └── user.model.js
└── routes
    ├── auth.routes.js
    └── user.routes.js
```

Y la estructura *frontend*:

```bash
.
├── admin.html
├── index.html
├── js
│   ├── admin.js
│   ├── hello.js
│   ├── login.js
│   ├── mod.js
│   ├── profile.js
│   └── register.js
├── login
│   └── index.html
├── mod.html
├── profile.html
└── register
    └── index.html
```

## ¿Qué se modificó?
En cuanto a los controladores, se ajustaron para enviar contenido de la base de datos dependiendo del rol (user, mod, admin):

`controllers/user.controller.js`

### Controlador *allAccess*
 

| Rol        | Acceso           |
| ------------- |:-------------:|
| General   |✅|
| User      |✅|
| Moderator | ✅|
| Admin | ✅|
 
Simplemente se añadió un contador de todos los usuarios registrados en la base de datos y un mensaje.

```javascript
exports.allAccess = async (req, res) => {

  try {

    const counter = await db.user.count();
    res.status(200).send({
      counter: counter,
      message: "Contenido Público.",
    });

  } catch (error) {

    console.error(error);
    res.status(500).send("Internal Server Error");

  }
};
```

### Controlador *userBoard*
 

| Rol        | Acceso           |
| ------------- |:-------------:|
| General   |❌|
| User      |✅|
| Moderator | ✅|
| Admin | ✅|

En esta parte busca si el usuario que solicita la información tiene un token valido y coincide con un usuario registrado, a partir de ello le entrega sus datos; dígase su nombre de usuario, correo, fecha de creación y su "contenido de usuario".

```javascript
exports.userBoard = (req, res) => {

  try {

    User.findByPk(req.userId).then((user) => {
      res.status(200).send({
        user: user.username,
        email: user.email,
        createdAt: user.createdAt.toLocaleDateString("es-ES"),
        message: "Contenido de usuario.",
      });
    });

  } catch (error) {

    console.error(error);
    res.status(500).send("Internal Server Error");

  }

};
```

### Controlador *adminBoard*
 

| Rol        | Acceso           |
| ------------- |:-------------:|
| General   |❌|
| User      |❌|
| Moderator | ❌|
| Admin | ✅|

Por ultimo, para el usuario con rol admin tiene acceso a los datos de todos los usuarios en la base de datos más el "contenido de admin". En primera instancia se recorre la base de datos a partir de determinados atributos; seguido a ello el array se filtra de manera que solo se envien los datos necesarios

```javascript
exports.adminBoard = async (req, res) => {

  try {

    const allUsers = await db.user.findAndCountAll({
      include: [
        {
          model: db.role,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      attributes: ["username", "email", "createdAt"],
    });

    const users = allUsers.rows.map((user) => {
      const username = user.username;
      const email = user.email;
      const createdAt = user.createdAt.toLocaleDateString("es-ES");
      const roles = user.roles.map((role) => role.name);
      return { username, email, createdAt, roles };
    });

    res.status(200).send({
      users: users,
      quantity: allUsers.count,
      message: "Contenido de admin.",
    });

  } catch (error) {

    console.error(error);
    res.status(500).send("Internal Server Error");
    
  }
};
```

* El controlador *moderatorBoard* se dejó por defecto.

`controllers/auth.controller.js`

Dentro de el controlador de autenticación se añadió la capacidad de insertar una cookie al usuario iniciar sesión, por lo que dentro de la función *signin* se añadió lo siguiente:

```javascript
res.setHeader('Set-Cookie', `${config.cookieName}=${token}; path=/;`);
```

Al mismo tiempo, tambien se añadió la función para poder realizar *logout*, donde simplemente el servidor limpia la cookie del usuario y lo redirige a la pantalla de login:

```javascript
exports.logout = (req, res) => {
  res.clearCookie(config.cookieName);
  res.redirect('/login');
};
```

`middleware/authJwt.js`

A la variable token se añadio a considerar las cookies del request, abriendo la posibilidad de poder confirmar la identidad de un usuario común.

```javascript
 const token = req.headers["x-access-token"] || req.cookies['user']
```

# Entrega 2

En esta entrega, radica su principal diferencia en el cambio de la base de datos de MySql a MongoDB; para realizar dicha tarea, aparte de utilizar como base la anterior entrega, se tomó como referencia el siguiente tutorial: [Node.js + MongoDB: User Authentication & Authorization with JWT](https://www.bezkoder.com/node-js-mongodb-auth-jwt/)

A causa de una serie de incompatibilidades entre lo mostrado en el tutorial y versiones de [*mongoose*](https://www.npmjs.com/package/mongoose) por encima de la versión 7.0.0, se modificó todas las funciones que interactuan con la base de datos para adaptarse a las nuevas versiones.