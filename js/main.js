document.addEventListener('DOMContentLoaded', function() {
    function loadContent(selector, url, welcomeMessage = false) {
        document.getElementById('contenido').innerHTML = '<div class="d-flex justify-content-center align-items-center" style="height: 92vh;"><div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"><span class="visually-hidden">Cargando contenido...</span></div></div>';
        //document.getElementById('texto-info').style.display = 'none';
        setTimeout(function() {
            if (welcomeMessage) {
                document.getElementById('contenido').innerHTML = '<h1 class="mt-3">Bienvenido</h1>';
                typeWriter();
            } else {
                fetch(url)
                .then(response => response.text())
                .then(data => {
                    document.getElementById('contenido').innerHTML = data;
                })
                .catch(error => {
                    document.getElementById('contenido').innerHTML = '<p>Error loading content.</p>';
                    console.error('Error:', error);
                });
            }
        }, 2000); // Timer of 2 seconds
    }

    function typeWriter() {
        const text = 'Bienvenido al emocionante mundo de la física interactiva con nuestro simulador web de Ley de Coulomb y Campo Eléctrico. Este proyecto tiene como objetivo ofrecer una experiencia educativa inmersiva donde los usuarios pueden explorar y visualizar las fuerzas electrostáticas y los campos eléctricos de una manera dinámica e intuitiva. Utilizando la Ley de Coulomb, que describe la fuerza entre dos cargas eléctricas, y los conceptos fundamentales del campo eléctrico, nuestro simulador permitirá a los usuarios manipular diferentes variables y observar cómo interactúan las cargas en un entorno visualmente atractivo. Ideal para estudiantes, educadores y entusiastas de la física, esta herramienta proporciona una plataforma para profundizar en el entendimiento de la electrostática y sus aplicaciones prácticas en el mundo real. Prepárate para descubrir y aprender a través de la simulación interactiva y el análisis detallado de fenómenos eléctricos.';
        let index = 0;

        function write() {
            if (index < text.length) {
                document.getElementById('texto-info').innerHTML += text.charAt(index);
                index++;
                setTimeout(write, 30); // Adjust the time for the typing speed
            } else {
                document.getElementById('texto-info').style.display = 'block';
            }
        }

        document.getElementById('texto-info').innerHTML = ''; // Clear the text container before writing
        write();
    }

    document.getElementById('inicio').addEventListener('click', function() {
        loadContent("#contenido", '', true);
    });

    document.getElementById('leyCoulomb').addEventListener('click', function() {
        loadContent("#contenido", '../src/leyCoulomb.html');
    });

    document.getElementById('campoElectrico').addEventListener('click', function() {
        loadContent("#contenido", '../src/campoElectrico.html');
    });

    document.getElementById('simulador').addEventListener('click', function() {
        loadContent("#contenido", '../src/simulador.html');
    });
});


function calculateForce() {
    const k = 8.99e9; // Constante de Coulomb en N·m²/C²
    const q1 = parseFloat(document.getElementById('charge1').value) * parseFloat(document.getElementById('charge1Unit').value);
    const q2 = parseFloat(document.getElementById('charge2').value) * parseFloat(document.getElementById('charge2Unit').value);
    const r = parseFloat(document.getElementById('distance').value) * parseFloat(document.getElementById('distanceUnit').value);

    if (r === 0) {
        alert("La distancia no puede ser cero.");
        return;
    }

    const force = (k * Math.abs(q1 * q2)) / (r * r);
    document.getElementById('force').textContent = formatScientific(force);

    drawCharges(q1, q2, r);
}

function formatScientific(value) {
    const exp = value.toExponential(2);
    return exp.includes('e+0') || exp.includes('e-0') ? value.toFixed(2) : exp;
}

function drawCharges(q1, q2, r) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const chargeRadius = 10;

    // Ajustar el tamaño del canvas según la distancia
    const scaleFactor = Math.max(1, r * 50 / (canvas.width / 2 - chargeRadius));
    canvas.width = 400 * scaleFactor;
    canvas.height = 200;

    // Redibujar las cargas con el nuevo tamaño del canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la primera carga
    ctx.beginPath();
    ctx.arc(centerX - r * 50, centerY, chargeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.stroke();
    ctx.fillText(`q1: ${formatScientific(q1)} C`, centerX - r * 50 - 20, centerY - 15);

    // Dibujar la segunda carga
    ctx.beginPath();
    ctx.arc(centerX + r * 50, centerY, chargeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.stroke();
    ctx.fillText(`q2: ${formatScientific(q2)} C`, centerX + r * 50 - 20, centerY - 15);

    // Dibujar la línea de distancia
    ctx.beginPath();
    ctx.moveTo(centerX - r * 50, centerY);
    ctx.lineTo(centerX + r * 50, centerY);
    ctx.stroke();
    ctx.fillText(`r: ${formatScientific(r)} m`, centerX - 20, centerY + 20);
}
