#!/bin/bash
dfx identity new 0000TestUser0
dfx identity use 0000TestUser0
dfx deploy hobbi

# Usuario Peter Capusoto
dfx identity new 0000TestUser1
dfx identity use 0000TestUser1
dfx canister call hobbi signUp '(record {
    name="Peter Capusoto"; 
    email=null; 
    bio="Biografía de Peter Capusoto"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'

export i0001CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0001CID editProfile '(record {
  name="Peter Capusoto"; 
  email=null; 
  bio="Biografía de Peter Capusoto";
  interests = vec {"Humor"; "Comedia"; "Filosofia"; "teatro"}
})'

titles=(
  "El verdadero poder del mate"
  "Cuando los fideos se rebelan"
  "La épica batalla contra el despertador"
  "El arte de hablar con la heladera"
  "Los héroes anónimos del asado"
  "Cuando el WiFi decide tomarse vacaciones"
  "El misticismo del pan duro en la mesa"
  "Manual para sobrevivir a un lunes"
  "La conspiración detrás del papel higiénico"
  "Reflexiones profundas en el baño"
)
bodies=(
  "Un buen mate no arregla la vida, pero al menos te da algo caliente mientras todo se cae a pedazos."
  "Los fideos no se cocinan solos, pero parece que se divierten viéndote buscar el colador."
  "El despertador no odia tus sueños, solo odia que existas."
  "Hablar con la heladera no es raro, lo raro es cuando te responde."
  "El asado no se quema solo, necesita la ayuda de un genio con una birra en la mano."
  "El WiFi siempre se corta justo cuando estás por enviar ese meme que cambiaría el mundo."
  "El pan duro es como un amigo de la infancia: difícil de masticar, pero imposible de tirar."
  "Un lunes es como la resaca de una fiesta que no disfrutaste."
  "El papel higiénico siempre desaparece cuando más lo necesitás. Coincidencia... no lo creo."
  "En el baño, uno encuentra la paz, la inspiración y a veces... la iluminación filosófica."
)
hashTagsSets=(
  "vec {\"Humor\"; \"Mate\"; \"Sobrevivir\"}"
  "vec {\"Comida\"; \"Fideos\"; \"Colador\"}"
  "vec {\"Despertador\"; \"Sueños\"; \"Drama\"}"
  "vec {\"Heladera\"; \"Diálogos\"; \"Reflexiones\"}"
  "vec {\"Asado\"; \"Héroes\"; \"Birra\"}"
  "vec {\"WiFi\"; \"Meme\"; \"Conexión\"}"
  "vec {\"PanDuro\"; \"Amistad\"; \"Recuerdos\"}"
  "vec {\"Lunes\"; \"Sobrevivir\"; \"Resaca\"}"
  "vec {\"PapelHigiénico\"; \"Conspiración\"; \"Urgencia\"}"
  "vec {\"Baño\"; \"Filosofía\"; \"Inspiración\"}"
)

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  dfx canister call $i0001CID createPost "(
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

dfx identity new 0000TestUser2
dfx identity use 0000TestUser2
dfx canister call hobbi signUp '(record {
    name="Alejandro Dolina"; 
    email=null; 
    bio="Biografía de Alejandro Dolina"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0002CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0002CID editProfile '(record {
  name="Alejandro Dolina"; 
  email=null; 
  bio="Biografía de Alejandro Dolina";
  interests = vec {"Humor"; "Filosofia"; "teatro"; "Música"; "Literatura"}
})'

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
  
  dfx canister call $i0002CID createPost "(
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


# Chopin
dfx identity new 0000TestUser3
dfx identity use 0000TestUser3
dfx canister call hobbi signUp '(record {
    name="Fedeico Chopin"; 
    email=null; 
    bio="Biografía de Fedeico Chopi"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0003CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0003CID editProfile '(record {
  name="Fedeico Chopin"; 
  email=null; 
  bio="Biografía de Fedeico Chopi"; 
  interests = vec {"Música"; "Piano"}
})'

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
  
  dfx canister call $i0003CID createPost "(
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

# Gamer
dfx identity new 0000TestUser4
dfx identity use 0000TestUser4
dfx canister call hobbi signUp '(record {
    name="Juan Gamer"; 
    email=null; 
    bio="Biografía de Juan Gamer"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0004CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')
dfx canister call $i0004CID editProfile '(record {
  name="Juan Gamer"; 
  email=null; 
  bio="Biografía de Juan Gamer"; 
  interests = vec {"Juegos"; "PS4"; "Tecnologia"}
})'

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
  
  dfx canister call $i0004CID createPost "(
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

# Hitchkoock
dfx identity new 0000TestUser5
dfx identity use 0000TestUser5
dfx canister call hobbi signUp '(record {
    name="Alfred Hitchkook"; 
    email=null; 
    bio="Biografía de Alfred Hitchkook"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0005CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0005CID editProfile '(record {
  name="Alfred Hitchkook"; 
  email=null; 
  bio="Biografía de Alfred Hitchkook";
  interests = vec {"Cine"; "Teatro"; "Terror"}
})'

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
  
  dfx canister call $i0005CID createPost "(
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
dfx identity new 0000TestUser6
dfx identity use 0000TestUser6
dfx canister call hobbi signUp '(record {
    name="Apple"; 
    email=null; 
    bio="Biografía de Apple"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0006CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0006CID editProfile '(record {
  name="Apple"; 
  email=null; 
  bio="Biografía de Apple"; 
  interests = vec {"Tecnologia"; "Informatica"}
})'

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
  
  dfx canister call $i0006CID createPost "(
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

#----------------------------
dfx identity new 0000TestUser7
dfx identity use 0000TestUser7
dfx canister call hobbi signUp '(record {
    name="Motoko Kusanagi"; 
    email=null; 
    bio="Biografía de Motoko Kusanagi"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0007CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0007CID editProfile '(record {
  name="Motoko Kusanagi"; 
  email=null; 
  bio="Biografía de Motoko Kusanagi"; 
  interests = vec {"Tecnologia"; "Combate"; "Artes Marciales"; "Cine"}
})'

titles=(
  "¿Quié eres?"
  "¿Artificial?"
  "Ética"
)
bodies=(
  "¿Qué determina que seas tú y no otra persona? Es la suma de tus experiencias, recuerdos y pensamientos lo que forma tu identidad, pero ¿qué pasaría si esos recuerdos fueran manipulados?"
  "No es que me importe si soy artificial o no. Lo que me importa es si puedo sentirme viva."
  "El avance tecnológico siempre supera a la ética. El problema es cómo vivir con las consecuencias."
)
hashTagsSets=(
  "vec {\"Recuerdos\"; \"Experiencias\"; \"Manipulación\"}"
  "vec {\"IA\"; \"Sentiminetos\"}"
  "vec {\"Ética\"; \"Tecnologia\"}"
)

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  dfx canister call $i0007CID createPost "(
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

#----------------------------------
dfx identity new 0000TestUser8
dfx identity use 0000TestUser8
dfx canister call hobbi signUp '(record {
    name="Chavo del Ocho"; 
    email=null; 
    bio="Biografía del Chavo"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0008CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0008CID editProfile '(record {
 name="Chavo del Ocho"; 
    email=null; 
    bio="Biografía del Chavo"; 
  interests = vec {"Comida"; "Jugar"; "Teatro"}
})'

titles=(
  "La Vecindad"
  "La Tortita de Jamón"
  "El Señor Barriga"
)
bodies=(
  "Vivir en una vecindad no es fácil, pero es el lugar donde he aprendido lo que significa la amistad y la paciencia (aunque a veces Don Ramón me gane en eso)."
  "¿Qué haría yo sin mis tortas de jamón? Son más que un alimento; son un sueño que me ayuda a seguir adelante."
  "¿Qué harías si alguien te cobrara siempre la renta, pero sabes que no tienes cómo pagar? Bueno, al menos yo siempre tengo un plan (aunque no funcione)."
)
hashTagsSets=(
  "vec {\"Vecindad\"; \"Amistad\"; \"DonRamon\"}"
  "vec {\"Comida\"; \"Sueños\"; \"TortaDeJamón\"}"
  "vec {\"Renta\"; \"Problemas\"; \"Ingenio\"}"
)

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  dfx canister call $i0008CID createPost "(
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
#---------------------
dfx identity new 0000TestUser9
dfx identity use 0000TestUser9
dfx canister call hobbi signUp '(record {
    name="Superman"; 
    email=null; 
    bio="Biografía de Superman"; 
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0009CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0009CID editProfile '(record {
 name="Chavo del Ocho"; 
    email=null; 
    bio="Biografía del Chavo"; 
  interests = vec {"Comida"; "Jugar"; "Teatro"}
})'

titles=(
  "El Hombre de Acero"
  "La Tierra y Krypton"
  "La Responsabilidad de un Héroe"
)
bodies=(
  "No soy solo Clark Kent ni solo Superman. Soy un puente entre dos mundos, y cada uno de ellos me ha moldeado de formas únicas."
  "Aunque mi hogar original fue Krypton, la Tierra es mi verdadera casa. Es aquí donde encontré amor, propósito y una causa por la que luchar."
  "Tener poderes increíbles no es lo difícil; lo complicado es decidir cuándo usarlos y cómo no perderme a mí mismo en el proceso."
)
hashTagsSets=(
  "vec {\"Superman\"; \"ClarkKent\"; \"Héroe\"}"
  "vec {\"Tierra\"; \"Krypton\"; \"Identidad\"}"
  "vec {\"Poder\"; \"Responsabilidad\"; \"Humanidad\"}"
)

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  dfx canister call $i0009CID createPost "(
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
#---------------------
dfx identity new 0000TestUser10
dfx identity use 0000TestUser10
dfx canister call hobbi signUp '(record {
    name="Juanjo Domínguez"; 
    email=null; 
    bio="Biografía del Juanjo Domínguez , Músico" ;  
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0010CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0010CID editProfile '(record {
    name="Juanjo Domínguez"; 
    email=null; 
    bio="Biografía del Juanjo Domínguez ,Músico ; 
  interests = vec {"Guitarra"; "Musica"; "Composicion"}
})'

titles=(
  "Mi Primera Guitarra"
  "El Poder de la Música"
  "Improvisación"
)
bodies=(
  "Nunca olvidaré el día en que tuve mi primera guitarra. No era perfecta, pero fue el inicio de un sueño que todavía sigo construyendo."
  "La música no es solo sonido; es emoción, conexión y una forma de entender el mundo. Cada acorde cuenta una historia."
  "Improvisar es como hablar con el alma. No sabes qué vas a decir, pero sabes que será auténtico."
)
hashTagsSets=(
  "vec {\"Música\"; \"Guitarra\"; \"PrimerosPasos\"}"
  "vec {\"Arte\"; \"Emoción\"; \"Conexión\"}"
  "vec {\"Improvisación\"; \"Autenticidad\"; \"Creación\"}"
)

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  dfx canister call $i0010CID createPost "(
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

#---------------------
dfx identity new 0000TestUser11
dfx identity use 0000TestUser11
dfx canister call hobbi signUp '(record {
    name="Mariana Muñiz"; 
    email=null; 
    bio="Biografía del Mariana Muñiz"  ;  
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0011CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0011CID editProfile '(record {
    name="Mariana Muñiz"; 
    email=null; 
    bio="Biografía del Mariana Muñiz"; 
  interests = vec {"Coleccionismo"; "Muñecas"; "musica"}
})'

titles=(
  "Mi Primer Muñeca"
  "El Arte de Coleccionar"
  "Cuidando Tesoros"
)
bodies=(
  "Todo empezó con una sola muñeca que mi abuela me regaló. Ahora mi colección cuenta historias de diferentes épocas y culturas."
  "Coleccionar no es acumular; es preservar historia, arte y un pedacito de la infancia en cada pieza."
  "Cada muñeca de mi colección es como un tesoro. Las cuido, las limpio y las exhibo como si fueran joyas."
)
hashTagsSets=(
  "vec {\"Muñecas\"; \"Historia\"; \"Infancia\"}"
  "vec {\"Arte\"; \"Colección\"; \"Pasión\"}"
  "vec {\"Tesoros\"; \"Cuidados\"; \"Coleccionismo\"}"
)

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  dfx canister call $i0011CID createPost "(
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

#---------------------
dfx identity new 0000TestUser12
dfx identity use 0000TestUser12
dfx canister call hobbi signUp '(record {
    name="José Robles"; 
    email=null; 
    bio="Biografía del José Robles" ;  
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0012CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0012CID editProfile '(record {
    name="José Robles"; 
    email=null; 
    bio="Biografía del José Robles";
  interests = vec {"Star Wars"; "Coleccionismo"; "Figuras"}
})'

titles=(
  "Una Galaxia Muy Lejana"
  "La Fuerza"
  "Personajes Inolvidables"
)
bodies=(
  "Desde que vi la primera película, supe que el universo de Star Wars sería parte de mi vida. Cada nave, planeta y batalla es un mundo por descubrir."
  "La Fuerza no es solo un poder; es un concepto que me inspira a buscar el equilibrio en mi propia vida."
  "Luke, Leia, Vader… los personajes de Star Wars no son solo íconos. Son reflejos de nuestras luchas y aspiraciones."
)
hashTagsSets=(
  "vec {\"StarWars\"; \"Galaxia\"; \"Aventuras\"}"
  "vec {\"LaFuerza\"; \"Equilibrio\"; \"Inspiración\"}"
  "vec {\"Personajes\"; \"Leyendas\"; \"Saga\"}"
)

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  dfx canister call $i0012CID createPost "(
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

#---------------------
dfx identity new 0000TestUser13
dfx identity use 0000TestUser13
dfx canister call hobbi signUp '(record {
    name="Laura Sánchez"; 
    email=null; 
    bio="Biografía del Laura Sánchezs";  
    avatar= opt blob "11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/11/22/33/44/55/66/77/88/99/00/";
    thumbnail = opt blob "11/22/33/44";
})'
export i0013CID=$(dfx canister call hobbi getMyCanisterId | awk -F'"' '{print $2}')

dfx canister call $i0013CID editProfile '(record {
    name="Laura Sánchez"; 
    email=null; 
    bio="Biografía del Laura Sánchezs";
  interests = vec {"Terror"; "Cine"}
})'

titles=(
  "Los 80 y el Cine"
  "Clásicos que Perduran"
  "Regreso al Futuro"
)
bodies=(
  "Los años 80 fueron una época mágica para el cine. Esos colores, esas historias… simplemente inolvidables."
  "Las películas de los 80 tienen algo especial: son atemporales. No importa cuánto pase el tiempo, siempre hay algo que aprender o disfrutar en ellas."
  "‘Regreso al Futuro’ no es solo una película; es un viaje a una era donde todo parecía posible."
)
hashTagsSets=(
  "vec {\"Cine80\"; \"Nostalgia\"; \"Magia\"}"
  "vec {\"Clásicos\"; \"Atemporal\"; \"Historias\"}"
  "vec {\"RegresoAlFuturo\"; \"ViajesEnElTiempo\"; \"CulturaPop\"}"
)

for i in "${!titles[@]}"; do
  title="${titles[i]}"
  body="${bodies[i]}"
  hashTags="${hashTagsSets[i]}"
  
  dfx canister call $i0013CID createPost "(
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


