# GALACTIC STRIKE #

Juego 2D de peleas en el espacio on-line hecho en JavaScript y NodeJS, con Phaser, Box2D y Socket.io.

#### Version 

Última actualización : 18/12/2015

#### Documentación

La documentación sobre este proyecto se encuentra en el directorio /docs

* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

# Despliegue

### ¿Cómo desplegar el servidor?

El servidor de juego es un servidor HTTP, que además conecta a los clientes del juego mediante gracias al framework Socket.io v1.3.7.

* Instalar NodeJS (la última versión probada es la v5.3.0).
* Situarse en este mismo directorio en la terminal (cmd en Windows).
* Ejecutar el siguiente comando en Windows

> node index.js 

* O éste (si no funciona en Linux)

> nodejs index.js 


### ¿Cómo acceder al juego?

Una vez desplegado el servidor:

* Abrir el navegador Google Chrome
* Acceder al localhost en el puerto que se indica al ejecutar el servidor, que por defecto es el 8080:
> localhost:8080


* En index.html, introducir el nickname del jugador y presionar Enter.
* El navegador intentará lanzar una ventana emergente con el juego, por lo que se han de permitir los pop-ups en esta página.
* La ventana se lanzará, cargando los recursos y mostrando la pantalla principal del juego.

# Desarrollo

## ¿Cómo carajos se usa el Git? (Para tontos) desde Brackets con Git #

### ¿Cómo subir al repositorio los cambios que has hecho? ###
* Checkbox a la izquierda de [Commit]
* Git commit... pon un mensaje DESCRIPTIVO de lo que has hecho
* Click en "Push to Remote" (cuarto desde la derecha)
* -> Push to current tracking branch
* -> Default push
* Ahora pones tu usuario y contraseña de BitBucket y le das a OK
* ¡Tachán!

### ¿Cómo me bajo un proyecto? ###
* Open Bash/Terminal console (tercero desde la derecha)
* cd /mi/ruta/local/
* git clone https://{tu_usuario}@bitbucket.org/Borjardo/galactic-strike-socket-io.git <- Importante que sea tu usuario
* Introduce tu contraseña
* ¡Tachán!

### Links interesantes ###
* https://help.github.com/articles/changing-a-remote-s-url/


### Who do I talk to? ###

* borja.fourquet@estudiante.uam.es
* eduardo.radio@estudiante.uam.es
