#!/bin/bash
dfx identity new deployerHobbi
dfx identity use deployerHobbi
dfx deploy hobbi

# Usuario Peter Capusoto
dfx identity new peterCapusoto
dfx identity use peterCapusoto
dfx canister call hobbi signUp '(record {
    name="Peter Capusoto"; 
    email=null; 
    bio="Biografía de Peter Capusoto"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'

export peterCID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')
# Define los valores dinámicos
titles=("Mi primer posteo" "Mi segundo posteo" "Mi tercer posteo")
bodies=("Este es el cuerpo del primer posteo" "Este es el segundo cuerpo" "Aquí está el tercero")
hashTagsSets=("vec {\"Arte\"; \"Cultura\"}" "vec {\"Tecnología\"; \"Ciencia\"}" "vec {\"Poe\"; \"Terror\"}")

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  # Ejecuta el comando con los valores dinámicos
  dfx canister call $peterCID createPost "(
    record {
      access = variant { Public };
      title = \"$title\";
      hashTags = $hashTags;
      body = \"$body\";
      image = opt blob \"11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/\";
      imagePreview = opt blob \"11/22/33/44\";
      image_url = null;
      media_type = variant { Game }
    }
  )"
done

# Usuario Alejandro Dolina

dfx identity new alejandroDolina
dfx identity use alejandroDolina
dfx canister call hobbi signUp '(record {
    name="Alejandro Dolina"; 
    email=null; 
    bio="Biografía de Alejandro Dolina"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export alejandroCID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')
titles=(
  "El misterio de las cosas simples"
  "La melancolía de los relojes detenidos"
  "Caminos que nunca tomamos"
  "El barrio que nunca duerme"
  "Fábulas de la noche eterna"
  "Las esquinas que inventaron el tiempo"
  "La tristeza de los tangos olvidados"
  "Conversaciones con sombras"
)
bodies=(
  "En cada esquina del barrio, los fantasmas bailan al ritmo de un tango perdido en la memoria."
  "El tiempo, implacable como un reloj que nunca se detiene, nos deja solo la ilusión de los caminos no tomados."
  "Las noches interminables esconden verdades que solo se revelan en susurros al oído atento."
  "Cada ventana iluminada cuenta una historia que quizás nunca será escuchada."
  "En el barrio de las almas errantes, las farolas alumbran no solo las calles, sino también los sueños."
  "El destino escribe sus versos en el aire, y nosotros los leemos con ojos de nostalgia."
  "Las sombras de la plaza juegan con nuestra percepción, invitándonos a un baile de enigmas."
  "A veces, las respuestas que buscamos están en el reflejo de un charco bajo la lluvia."
)
hashTagsSets=(
  "vec {\"Tango\"; \"Filosofía\"; \"Barrio\"; \"Musica\"}"
  "vec {\"Nostalgia\"; \"Tiempo\"}"
  "vec {\"Sombras\"; \"Enigmas\"}"
  "vec {\"Sueños\"; \"Barrio\"}"
  "vec {\"Noches\"; \"Historias\"}"
  "vec {\"Almas\"; \"Fábulas\"}"
  "vec {\"Plaza\"; \"Destino\"}"
  "vec {\"Lluvia\"; \"Reflejos\"}"
)

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  # Ejecuta el comando con los valores dinámicos
  dfx canister call $alejandroCID createPost "(
    record {
      access = variant { Public };
      title = \"$title\";
      hashTags = $hashTags;
      body = \"$body\";
      image = opt blob \"11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/\";
      imagePreview = opt blob \"11/22/33/44\";
      image_url = null;
      media_type = variant { Game }
    }
  )"
done


# Musica
dfx identity new fede
dfx identity use fede
dfx canister call hobbi signUp '(record {
    name="Fedeico Chopin"; 
    email=null; 
    bio="Biografía de Fedeico Chopi"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export fedeCID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

titles=(
  "El alma de las cuerdas vibrantes"
  "La poesía oculta en cada nota"
  "Melodías que trazan historias"
  "La nostalgia de los vinilos"
  "Conciertos bajo la luna"
  "Las canciones que definieron una generación"
  "Ecos de guitarras en el viento"
  "La armonía de lo inesperado"
  "Ritmos que mueven el alma"
  "Cuando el silencio se hace música"
)
bodies=(
  "Cada canción cuenta una historia, y cada historia tiene un eco en el alma de quien escucha."
  "Los vinilos giran, como los recuerdos, atrapando momentos en sus melodías."
  "Un acorde puede cambiar el ánimo de un día entero, porque la música es magia pura."
  "Bajo la luna, la música encuentra su hogar, iluminando corazones con sus ritmos."
  "Los conciertos son lugares donde el tiempo se detiene y el alma vibra al compás."
  "Las generaciones se unen a través de las canciones que marcaron sus días."
  "La guitarra canta historias que solo se entienden con el corazón."
  "A veces, la mejor música nace de lo inesperado, como un improvisado solo de jazz."
  "Los ritmos tienen un poder único: pueden mover el cuerpo y sanar el espíritu."
  "El silencio también tiene su música, si sabemos escuchar."
)
hashTagsSets=(
  "vec {\"Música\"; \"Armonía\"; \"Vinilos\"; \"Conciertos\"}"
  "vec {\"Melodías\"; \"Nostalgia\"}"
  "vec {\"Jazz\"; \"Improvisación\"}"
  "vec {\"Ritmo\"; \"Cuerdas\"}"
  "vec {\"Magia\"; \"Notas\"}"
  "vec {\"Generaciones\"; \"Canciones\"}"
  "vec {\"Guitarra\"; \"Historias\"}"
  "vec {\"Conciertos\"; \"Luna\"}"
  "vec {\"Silencio\"; \"Magia\"}"
  "vec {\"Recuerdos\"; \"Vinilos\"}"
)

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  # Ejecuta el comando con los valores dinámicos
  dfx canister call $fedeCID createPost "(
    record {
      access = variant { Public };
      title = \"$title\";
      hashTags = $hashTags;
      body = \"$body\";
      image = opt blob \"11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/\";
      imagePreview = opt blob \"11/22/33/44\";
      image_url = null;
      media_type = variant { Game }
    }
  )"
done

# Videojuegos
dfx identity new gamer
dfx identity use gamer
dfx canister call hobbi signUp '(record {
    name="Juan Gamer"; 
    email=null; 
    bio="Biografía de Juan Gamer"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export gamerCID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

titles=(
  "Exploradores de mundos virtuales"
  "Cuando los píxeles cuentan historias"
  "Estrategias en tiempo real"
  "Los héroes que elegimos ser"
  "Bajo la luz de los RPG"
  "La nostalgia de los juegos retro"
  "Desafíos en primera persona"
  "Conquistas en multijugador"
  "El arte detrás de los videojuegos"
  "Cuando perder también es ganar"
)
bodies=(
  "Cada partida es un viaje, y cada jugador es un héroe en su propia historia virtual."
  "Los píxeles de antaño nos llevan a tiempos donde lo simple era mágico."
  "Estrategia y rapidez son claves en los juegos que no dejan margen de error."
  "En los mundos virtuales, cada decisión define quiénes somos como jugadores."
  "Los RPG son lugares donde las historias se tejen y los personajes cobran vida."
  "Volver a jugar un clásico es como reencontrarse con un viejo amigo."
  "Las partidas multijugador nos enseñan que juntos somos más fuertes."
  "El arte en los videojuegos está en cada textura, cada sonido y cada historia."
  "Incluso cuando perdemos, aprendemos algo en el camino."
  "Los videojuegos son más que un pasatiempo; son una forma de expresión."
)
hashTagsSets=(
  "vec {\"Videojuegos\"; \"RPG\"; \"Aventura\"; \"Héroes\"}"
  "vec {\"Nostalgia\"; \"Píxeles\"}"
  "vec {\"Estrategia\"; \"TiempoReal\"}"
  "vec {\"Multijugador\"; \"Cooperación\"}"
  "vec {\"Arte\"; \"Diseño\"}"
  "vec {\"Retro\"; \"Clásicos\"}"
  "vec {\"Mundos\"; \"Historias\"}"
  "vec {\"Juegos\"; \"Virtual\"}"
  "vec {\"Perder\"; \"Aprender\"}"
  "vec {\"Expresión\"; \"Gaming\"}"
)
for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  # Ejecuta el comando con los valores dinámicos
  dfx canister call $gamerCID createPost "(
    record {
      access = variant { Public };
      title = \"$title\";
      hashTags = $hashTags;
      body = \"$body\";
      image = opt blob \"11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/\";
      imagePreview = opt blob \"11/22/33/44\";
      image_url = null;
      media_type = variant { Game }
    }
  )"
done

#Cine
dfx identity new alfred
dfx identity use alfred
dfx canister call hobbi signUp '(record {
    name="Alfred Hitchkook"; 
    email=null; 
    bio="Biografía de Alfred Hitchkook"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export alfredCID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

titles=(
  "La magia detrás de la pantalla"
  "Historias que dejan huella"
  "El arte de los finales inesperados"
  "Cuando el cine es poesía"
  "La nostalgia de los clásicos"
  "Bajo las luces del celuloide"
  "El poder de un buen guion"
  "Personajes que trascienden generaciones"
  "La banda sonora de nuestras vidas"
  "Cuando la cámara habla"
)
bodies=(
  "El cine nos transporta a mundos donde los sueños toman forma."
  "Cada película es una ventana a emociones que a veces tememos explorar."
  "Los finales inesperados nos recuerdan que la vida también es impredecible."
  "En cada escena bien lograda hay poesía escondida entre los fotogramas."
  "Los clásicos del cine nos enseñan que algunas historias son eternas."
  "Bajo la luz del proyector, el cine cobra vida como arte y magia."
  "Un buen guion puede cambiar la percepción de una historia entera."
  "Los personajes bien escritos viven en nuestra memoria para siempre."
  "La música en el cine no solo acompaña, sino que define momentos."
  "La cámara no solo captura imágenes, sino emociones."
)
hashTagsSets=(
  "vec {\"Cine\"; \"Historias\"; \"Arte\"}"
  "vec {\"Clásicos\"; \"Nostalgia\"}"
  "vec {\"Finales\"; \"Guion\"}"
  "vec {\"Emociones\"; \"Películas\"}"
  "vec {\"Proyector\"; \"Celuloide\"}"
  "vec {\"Personajes\"; \"Generaciones\"}"
  "vec {\"BandaSonora\"; \"Cine\"}"
  "vec {\"Cámara\"; \"Arte\"}"
  "vec {\"Historias\"; \"Fotogramas\"}"
  "vec {\"Magia\"; \"Luces\"}"
)
for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  # Ejecuta el comando con los valores dinámicos
  dfx canister call $alfredCID createPost "(
    record {
      access = variant { Public };
      title = \"$title\";
      hashTags = $hashTags;
      body = \"$body\";
      image = opt blob \"11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/\";
      imagePreview = opt blob \"11/22/33/44\";
      image_url = null;
      media_type = variant { Game }
    }
  )"
done


# Tecnologia
dfx identity new apple
dfx identity use apple
dfx canister call hobbi signUp '(record {
    name="Apple"; 
    email=null; 
    bio="Biografía de Apple"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export appleCID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')
titles=(
  "El futuro está en nuestras manos"
  "Innovaciones que cambian el mundo"
  "La inteligencia artificial y nosotros"
  "El impacto de la tecnología en la vida diaria"
  "Redefiniendo la comunicación"
  "La revolución digital en curso"
  "Explorando el universo desde casa"
  "El arte de programar el mañana"
  "Conectividad sin fronteras"
  "La ética en la era de los algoritmos"
)
bodies=(
  "Cada avance tecnológico redefine cómo vivimos, trabajamos y soñamos."
  "Las innovaciones tecnológicas no solo solucionan problemas, también crean nuevas oportunidades."
  "La inteligencia artificial nos reta a repensar nuestra relación con la tecnología."
  "En cada pantalla, hay una ventana hacia un mundo de posibilidades."
  "La comunicación digital nos acerca a quienes están lejos y nos aleja de los cercanos."
  "La revolución digital es un cambio que nunca se detiene."
  "Desde un telescopio virtual, podemos explorar las estrellas como nunca antes."
  "Programar es escribir el futuro en líneas de código."
  "La conectividad global nos une en un mundo cada vez más pequeño."
  "En la era de los algoritmos, la ética nunca fue tan importante."
)
hashTagsSets=(
  "vec {\"Tecnología\"; \"Innovación\"; \"Futuro\"}"
  "vec {\"IA\"; \"Avances\"}"
  "vec {\"Comunicación\"; \"Digital\"}"
  "vec {\"Revolución\"; \"Programación\"}"
  "vec {\"Conectividad\"; \"Ética\"}"
  "vec {\"Exploración\"; \"Universo\"}"
  "vec {\"Código\"; \"Mañana\"}"
  "vec {\"Pantallas\"; \"Posibilidades\"}"
  "vec {\"Global\"; \"Unión\"}"
  "vec {\"Algoritmos\"; \"Impacto\"}"
)

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  # Ejecuta el comando con los valores dinámicos
  dfx canister call $appleCID createPost "(
    record {
      access = variant { Public };
      title = \"$title\";
      hashTags = $hashTags;
      body = \"$body\";
      image = opt blob \"11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/\";
      imagePreview = opt blob \"11/22/33/44\";
      image_url = null;
      media_type = variant { Game }
    }
  )"
done




