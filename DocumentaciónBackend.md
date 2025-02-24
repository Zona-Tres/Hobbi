### Documentación general. Backend
El sistema está diseñado para que cada usuario tenga su propio espacio de almacenamiento (canister dedicado), mientras el canister principal de la plataforma ("Hobbi") actúa como índice centralizado y servicio de previsualización. Esto optimiza consultas rápidas y reduce la carga en los canisters individuales al manejar notificaciones y vistas previas en un lugar común.

---
### Componentes y Roles
##### Canister Principal (Hobbi):

1. Gestión de Usuarios:
    + Despliega canisters exclusivos para cada usuario nuevo y guarda una referencia (ID del canister del usuario) en su índice.
    + Envia una version de previsualizacion del perfil al canister indexer, la cual contendrá la información basica mas una version reducida de la foto de perfil ( creo que funciona bien hasta incluso con 5KB de tamaño )
2. Notificaciones de Posts:
    + Recibe notificaciones cuando un usuario publica o comenta un post .
    + Almacena estas notificaciones en un HashMap para que sus seguidores puedan acceder a ellas directamente
3. Feed Paginado:
    + Proporciona un mecanismo para consultar y paginar las notificaciones relevantes para un usuario. Es decir, si un usuario sigue a Bob y a Alice, se consultan por esos dos usuarios en el HashMap de notificaciones y se extraen las ultimsa notificaciones asociadas a Bob y Alice, devolviendo dichas vistas previas en un orden prioritario y dejando que el resto del feed se complete con lo que haya disponible en ese momento en la plataforma.
    + Este feed se devolvera de forma paginada (posiblemente pueda tratarse de unos 20 o 30 elementos por llamada) mas un valor Booleano que indicará si hay mas elementos disponibles
##### Canister de Usuario:

1. Almacenamiento de Datos de Usuario:
    + Guarda posts, seguidores y seguidos.
2. Gestión de Seguidores y Seguidos:
    + Seguidores:
        + Se identifican por el Principal ID de cada usuario.
        + Este ID se almacena en un SetMap dentro del canister del autor del perfil.
        + Los seguidores pueden comunicarse directamente desde el frontend con el canister del usuario seguido para obtener actualizaciones.
    + Seguidos:
        + Se identifican por el Principal ID del canister del usuario seguido.
        + Este ID se almacena en un SetMap dentro del canister de cada usuario.
        + Esto permite que un usuario mantenga una lista actualizada de los canisters que está siguiendo.
4. Gestión de Posts:
    + Almacena los posts completos en el canister del autor.
    + Envía una notificación al canister Hobbi cada vez que un post es publicado.

##### Indexer canister
Se despliega automaticamente desde el canister Hobbi cuando se registra el primer usuario y esta destinado a almacenar una versión previa de cada perfil. Esto es. Nombre, Foto reducida a unos 10K, cantidad de seguidores... etc.
El objetido es la visualizacion masiva rápida de perfiles sin tener que consultar los respectivos canister class de cada uno.
1. Interacción con el canister Hobbi.
    + Cada vez que se registra un nuevo usuario en Hobbi, se guarda una vista previa del perfil de dicho usuario y una referencia a su canister Id mediante la cual se podra desde el front acceder al perfil completo.
2. Interaccion con el frontend
    + Secciones follores/followeds
        + Para obtener las vistas previas de estos usuarios el front debe primero recuperar del canister del propio usuario las dos listas (seguidores y seguidos) para luego enviarlas al indexer.
        + Una vez recuperadas ambas listas existe en el canister index dos funciones. Una de ellas, dedicada a devolver vistas previas de followers, toma como parametro una lista de Principal IDs y devuelve las correspondientes vistas previas de los usuarios asociados. La otra, dedicada a devolver las vistas de los Followeds toma en cambio una lista de Canister IDs, y devuelve tambien un lista con las vistas previas asciadas a esos Canister Id.
3. Interacción con UserActorClass
    + No implementada... Actualización de vistas previas en funcion de las modificaciones de datos del usuario, publicación de posts etc.
##### Frontend Canister:

1. Interacción con Hobbi:
    + Consulta el feed de notificaciones desde el canister principal Hobbi para construir la interfaz del usuario (ej. el feed paginado).
2. Interacción Directa con Canisters de Usuarios:
    + Se comunica directamente con los canisters de usuarios seguidos para realizar acciones como:
    + Consultar detalles de un perfil.
    + Leer posts completos.
    + Seguir o dejar de seguir a un usuario.
    + Reaccionar o comentar posts