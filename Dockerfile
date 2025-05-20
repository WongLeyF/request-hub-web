# Utilizamos la imagen de node como base ya que la necesitamos para "compilar" los fuentes del proyecto Angular. Denominaremos a esta imagen "build"
FROM node as build

# Copiamos el fichero package.json a una nueva carpeta de trabajo
COPY ./package.json /usr/angular-workdir/
WORKDIR /usr/angular-workdir

# Lanzamos el comando npm install para que node se descargue todas las dependencias
# definidas en nuestro fichero package.json
RUN yarn install

# Copiamos todo el código del proyecto a la carpeta de trabajo
COPY ./ /usr/angular-workdir

# Ahora que tenemos todas las dependencias y todo el código podemos generar
# nuestro entregable ejecutando el siguiente comando.
RUN yarn build

# Llega el momento de preparar el servidor web, para ello usaremos la imagen base
# de Nginx
FROM nginx

# Copiamos el fichero nginx.conf a la ruta adecuada en la imagen nginx
COPY ./nginx.conf /etc/nginx/nginx.conf

# Borramos todos los ficheros que pudieran existir en la ruta donde desplegaremos
# el desplegable que hemos generado antes
RUN rm -rf /usr/share/nginx/html/*

# Finalmente copiamos nuestro entregable desde la imagen de node a la ruta de despliegue
# en la imagen de Nginx
COPY --from=build /usr/angular-workdir/dist/request-hub /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
