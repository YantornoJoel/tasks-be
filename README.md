# tupaca-backend
Prueba técnica hecha con Node - Typescript, la cual usa MongoDb como base de datos.

## Instalación
Ejecute el siguiente comando:

```bash
pnpm install
```

#### Express - Nodemon - Cors

## Instrucciones
Para levantar el proyecto hace falta completar algunos datos en el archivo .env.example
1. Ingrese un puerto, por ejemplo `3001`
2. Debe crear una base de datos online en Mongo Atlas: `https://account.mongodb.com/account/login` 
3. Una vez creada la base de datos, cree un usuario y contraseña
4. Luego conectarse mediante Compass, copie la cadena de conexión y reemplace los parámetros de usuario y contraseña por los previamente creados
5. Ingrese una dirección para FRONTEND_URL, en caso que se use vite, poner la dirección por defecto: `"http://localhost:5173"`


## Iniciar
Una vez hecho correctamente estos pasos, ya puede levantar el backend con el comando
```bash
pnpm start
```
