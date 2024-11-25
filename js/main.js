document.addEventListener('DOMContentLoaded', function () {
    const title = 'Bienvenido';
    const text = 'Bienvenido al emocionante mundo de la física interactiva con nuestro simulador web de Ley de Coulomb y Campo Eléctrico. Este proyecto tiene como objetivo ofrecer una experiencia educativa donde los usuarios pueden explorar y visualizar las fuerzas electrostáticas y los campos eléctricos de una manera dinámica e intuitiva. Utilizando la Ley de Coulomb, que describe la fuerza entre dos cargas eléctricas, y los conceptos fundamentales del campo eléctrico, nuestro simulador permitirá a los usuarios manipular diferentes variables y observar cómo interactúan las cargas en un entorno visualmente atractivo. Ideal para estudiantes, educadores y entusiastas de la física, esta herramienta proporciona una plataforma para profundizar en el entendimiento de la electrostática y sus aplicaciones prácticas en el mundo real. Prepárate para descubrir y aprender a través de la simulación interactiva y el análisis detallado de fenómenos eléctricos.';

    function typeWriter() {
        const textContainer = document.getElementById('texto-info');
        textContainer.style.display = 'block';
        textContainer.innerHTML = `<h1>${title}</h1><p></p>`; // Agrega el título y un contenedor para el texto
        const textParagraph = textContainer.querySelector('p');
        let index = 0;

        function write() {
            if (index < text.length) {
                textParagraph.innerHTML += text.charAt(index); // Añade una letra a la vez
                index++;
                setTimeout(write, 30); // Ajusta la velocidad de escritura
            }
        }

        write(); // Inicia la escritura
    }

    function loadContent(selector, url, showWelcome = false) {
        const content = document.getElementById('contenido');
        const textContainer = document.getElementById('texto-info');

        // Limpia y oculta el texto informativo en cada carga de contenido
        textContainer.style.display = 'none';
        textContainer.innerHTML = '';

        // Muestra un spinner mientras se carga el contenido
        content.innerHTML = '<div class="d-flex justify-content-center align-items-center" style="height: 92vh;"><div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"><span class="visually-hidden">Cargando contenido...</span></div></div>';

        setTimeout(function () {
            if (showWelcome) {
                content.innerHTML = ''; // Limpia el contenido del índice
                typeWriter(); // Activa el mensaje de bienvenida
            } else {
                fetch(url)
                    .then(response => response.text())
                    .then(data => {
                        content.innerHTML = data; // Carga el contenido desde el archivo HTML
                    })
                    .catch(error => {
                        content.innerHTML = '<p>Error loading content.</p>';
                        console.error('Error:', error);
                    });
            }
        }, 2000); // Temporizador de 2 segundos
    }

    // Muestra el texto al cargar la página inicialmente
    typeWriter();

    // Asigna eventos a los botones de navegación
    document.getElementById('inicio').addEventListener('click', function () {
        loadContent("#contenido", '', true); // Activa el mensaje de bienvenida
    });

    document.getElementById('leyCoulomb').addEventListener('click', function () {
        loadContent("#contenido", '../src/leyCoulomb.html'); // Carga Ley de Coulomb
    });

    document.getElementById('campoElectrico').addEventListener('click', function () {
        loadContent("#contenido", '../src/campoElectrico.html'); // Carga Campo Eléctrico
    });

    document.getElementById('simulador').addEventListener('click', function () {
        loadContent("#contenido", '../src/simulador.html'); // Carga Simulador
    });
});
