// Configuración principal del juego
const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    backgroundColor: "#1a1a1a",
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config); // Instancia del juego después de la configuración

let textoPregunta;
let intentosRestantes;
let seleccionesJugador;
let celdasGrid;
let intentosPorPregunta={};


function preload() {
    this.load.image('transportes', 'assets/imagenes/transporte.png');
    this.load.image('animales', 'assets/imagenes/animales.png');
    this.load.image('instrumentos', 'assets/imagenes/instrumentos.png');
    this.load.audio('tambor', 'assets/sonidos/tambor.mp3');
    this.load.audio('triangulo', 'assets/sonidos/triangulo.mp3');
    this.load.audio('violonchelo', 'assets/sonidos/violonchelo.mp3');
    this.load.audio('piano', 'assets/sonidos/piano.mp3');
    this.load.audio('guitarra electrica', 'assets/sonidos/guitarra_electrica.mp3');
    this.load.audio('xilofono', 'assets/sonidos/xilofono.mp3');
    this.load.audio('ukelele', 'assets/sonidos/ukelele.mp3');
    this.load.audio('bateria', 'assets/sonidos/bateria.mp3');
    this.load.audio('guitarra acustica', 'assets/sonidos/guitarra_acustica.mp3');
    this.load.audio('flauta', 'assets/sonidos/flauta.mp3');
    this.load.audio('violin', 'assets/sonidos/violin.mp3');
    this.load.audio('avion', 'assets/sonidos/avion.mp3');
    this.load.audio('camion', 'assets/sonidos/camion.mp3');
    this.load.audio('tren', 'assets/sonidos/tren.mp3');
    this.load.audio('barco', 'assets/sonidos/barco.mp3');
    this.load.audio('elefante', 'assets/sonidos/elefante.mp3');
    this.load.audio('jirafa', 'assets/sonidos/jirafa.mp3');
    this.load.audio('hipopotamo', 'assets/sonidos/hipopotamo.mp3');
    this.load.audio('leon', 'assets/sonidos/leon.mp3');
    this.load.audio('cebra', 'assets/sonidos/cebra.mp3');
    this.load.audio('oso panda', 'assets/sonidos/oso_panda.mp3');
    this.load.audio('koala', 'assets/sonidos/koala.mp3');
    this.load.audio('mono', 'assets/sonidos/mono.mp3');
    this.load.audio('tigre', 'assets/sonidos/tigre.mp3');
}

function create() {
    // Texto título
    this.add.text(300, 60, 'Minijuego de Memoria', { fontSize: '48px', fill: '#fff' });

    // Botón "Comenzar"
    let boton = this.add.text(530, 250, 'Comenzar', { fontSize: '32px', fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', () => {
            boton.destroy(); // Quita el botón
            iniciarNivel1.call(this); // Iniciar el Nivel 1 al hacer clic en "Comenzar"
        });
}

function update() {}

// --------------------- Nivel 1: Medios de Transporte ---------------------
let transportesData = {
    'avion': ['A1'],
    'camion': ['A2'],
    'tren': ['B1'],
    'barco': ['B2']
};
let transportesArray = Object.keys(transportesData);
let transportesImage; // Para la imagen de transportes

function iniciarNivel1() {
    console.log('Iniciando Nivel 1: Medios de Transporte');
    intentosRestantes = 2; // Usando 2 intentos como en el Nivel 3
    seleccionesJugador = [];
    celdasGrid = {}; // Limpiar el objeto de celdas
    instrumentoActual = Phaser.Math.RND.pick(transportesArray); // Reutilizamos 'instrumentoActual' para el transporte
    ubicacionesCorrectas = transportesData[instrumentoActual];
    console.log('Transporte a encontrar:', instrumentoActual, 'en las ubicaciones:', ubicacionesCorrectas);

    intentosPorPregunta[`Nivel 1 - ${instrumentoActual}`] = 0;

    // Ocultar texto anterior si existe
    if (textoPregunta) {
        textoPregunta.setVisible(false);
    }

    // Mostrar imagen de transporte
    transportesImage = this.add.image(600, 400, 'transportes').setScale(0.3); // Ajusta la escala si es necesario

    // Texto de cuenta regresiva
    let contadorTexto = this.add.text(100, 100, '10', { fontSize: '48px', fill: '#fff' });
    let tiempoRestante = 10;

    let cuentaRegresivaTimer = this.time.addEvent({
        delay: 1000,
        repeat: 9,
        callback: () => {
            tiempoRestante--;
            contadorTexto.setText(tiempoRestante.toString());
        },
        callbackScope: this
    });

    // Crear el texto de la pregunta, pero hacerlo invisible inicialmente
    textoPregunta = this.add.text(340, 160, '¿Dónde estaba el ' + instrumentoActual + '?', {
        fontSize: '36px',
        fill: '#fff'
    }).setVisible(false); // Establecer como invisible

    // Después de 10 segundos, destruir imagen, sonido y mostrar cuadrícula
    this.time.delayedCall(10000, () => {
        if (transportesImage) {
            transportesImage.destroy();
        }
        if (contadorTexto) {
            contadorTexto.destroy();
        }
        cuentaRegresivaTimer.destroy();

        // Reproducir el sonido del transporte actual
        this.sound.play(instrumentoActual);

        mostrarCuadriculaNivel1.call(this);
    }, [], this);
}

function mostrarCuadriculaNivel1() {
    // Hacer visible el texto de la pregunta
    if (textoPregunta) {
        textoPregunta.setVisible(true);
    }

    const filas = 2;
    const columnas = 2;
    const tamañoCelda = 200; // Ajustamos el tamaño de las celdas para la cuadrícula 2x2
    const margenX = 400; // Ajustamos el margen para centrar la cuadrícula 2x2
    const margenY = 200;
    const letrasFilas = ['A', 'B'];

    let maxSelecciones = 1; // En el Nivel 1, cada medio de transporte ocupa 1 celda

    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            const x = margenX + col * tamañoCelda;
            const y = margenY + fila * tamañoCelda;
            const idCelda = letrasFilas[fila] + (col + 1);

            let celda = this.add.rectangle(x + tamañoCelda / 2, y + tamañoCelda / 2, tamañoCelda, tamañoCelda, 0xffffff).setStrokeStyle(2, 0x00ff00);
            celda.setOrigin(0.5);
            celda.setInteractive();
            celda.setData('id', idCelda);
            celdasGrid[idCelda] = celda;

            celda.on('pointerdown', () => {
                const id = celda.getData('id');

                if (!seleccionesJugador.includes(id) && seleccionesJugador.length < maxSelecciones) {
                    seleccionesJugador.push(id);
                    celda.setFillStyle(0xffff00);

                    // Verificar la respuesta inmediatamente después de la selección
                    for (const id in celdasGrid) {
                        celdasGrid[id].disableInteractive();
                    }
                    verificarRespuestaNivel1.call(this);
                }
            });
        }
    }
}

function verificarRespuestaNivel1() {

    // 🧹 Eliminar mensajes anteriores
this.children.list.forEach(child => {
        if (child.text && (

            child.text.startsWith('¡Correcto!') ||

            child.text.startsWith('¡Incorrecto!') ||

            child.text.startsWith('Se acabaron los intentos.')
        )) {

            child.destroy();
        }
    });

    let acerto = false;

    if (seleccionesJugador.length === 1 && seleccionesJugador[0] === ubicacionesCorrectas[0]) {

        acerto = true;

    }



    // Mostrar feedback

    if (acerto) {
        this.add.text(300, 750, '¡Correcto! Pasando al Nivel 2...', { fontSize: '36px', fill: '#0f0' });

        seleccionesJugador.forEach(id => {
            if (celdasGrid[id]) {
                celdasGrid[id].setFillStyle(0x00ff00); // Verde si acierta
            }
        });

        // Eliminar imagen del Nivel 1
        if (transportesImage) {
            transportesImage.destroy();
            transportesImage = null; // Limpiar la referencia
        }

        // Limpiar la cuadrícula del Nivel 1
        for (const id in celdasGrid) {
            if (celdasGrid.hasOwnProperty(id)) {
                celdasGrid[id].destroy();
            }
        }
        celdasGrid = {}; // Reiniciar el objeto celdasGrid

        // Eliminar mensajes de error del Nivel 1 si existen
        this.children.list.forEach(child => {
            if (child.text && (
                child.text.startsWith('¡Incorrecto!') ||
                child.text.startsWith('Se acabaron los intentos.')
            )) {
                child.destroy();
            }
        });

        this.time.delayedCall(2000, () => {
            iniciarNivel2.call(this); // Llamaremos a la función para iniciar el Nivel 2
        });



    } else {

        intentosRestantes--;

        intentosPorPregunta[`Nivel 1 - ${instrumentoActual}`]++; // Incrementar contador

        this.add.text(260, 620, '¡Incorrecto! Te quedan ' + intentosRestantes + ' intentos.', { fontSize: '36px', fill: '#f00' });



        seleccionesJugador.forEach(id => {

            if (celdasGrid[id]) {

                celdasGrid[id].setFillStyle(0xff0000); // Rojo si falla

            }

        });



        this.time.delayedCall(1000, () => {

            seleccionesJugador.forEach(id => {

                if (celdasGrid[id]) {

                    celdasGrid[id].setFillStyle(0xffffff); // Restaurar

                    celdasGrid[id].setInteractive(); // Reactivar

                }

            });

            seleccionesJugador = [];



            if (intentosRestantes === 0) {

                this.add.text(100, 680, 'Se acabaron los intentos. Vuelve a intentar', { fontSize: '36px', fill: '#f00' });

                this.time.delayedCall(3000, () => {

                    iniciarNivel1.call(this); // Volver a intentar el Nivel 1

                });

            } else {

                for (const idCelda in celdasGrid) {

                    celdasGrid[idCelda].setInteractive();

                }

            }

        });

    }

}


// --------------------- Nivel 2: Animales ---------------------
let animalesData = {
    'elefante': ['A1'],
    'jirafa': ['A2'],
    'hipopotamo': ['A3'],
    'leon': ['B1'],
    'cebra': ['B2'],
    'oso panda': ['B3'],
    'koala': ['C1'],
    'mono': ['C2'],
    'tigre': ['C3']
};
let animalesArray = Object.keys(animalesData);
let animalesImage; // Para la imagen de animales

function iniciarNivel2() {
    console.log('Iniciando Nivel 2: Animales');
    intentosRestantes = 2; // Usando 2 intentos
    seleccionesJugador = [];
    celdasGrid = {}; // Limpiar el objeto de celdas
    instrumentoActual = Phaser.Math.RND.pick(animalesArray); // Reutilizamos 'instrumentoActual'
    ubicacionesCorrectas = animalesData[instrumentoActual];
    console.log('Animal a encontrar:', instrumentoActual, 'en las ubicaciones:', ubicacionesCorrectas);

    intentosPorPregunta[`Nivel 2 - ${instrumentoActual}`] = 0;
    // Ocultar texto anterior si existe
    if (textoPregunta) {
        textoPregunta.setVisible(false);
    }

    // Mostrar imagen de animales
    animalesImage = this.add.image(600, 400, 'animales').setScale(1.5); // Ajusta la escala si es necesario

    // Texto de cuenta regresiva
    let contadorTexto = this.add.text(100, 100, '10', { fontSize: '48px', fill: '#fff' });
    let tiempoRestante = 10;

    let cuentaRegresivaTimer = this.time.addEvent({
        delay: 1000,
        repeat: 9,
        callback: () => {
            tiempoRestante--;
            contadorTexto.setText(tiempoRestante.toString());
        },
        callbackScope: this
    });

    // Crear el texto de la pregunta, pero hacerlo invisible inicialmente
    textoPregunta = this.add.text(300, 120, '¿Dónde estaba el ' + instrumentoActual + '?', { // Reutilizamos 'instrumentoActual'
        fontSize: '36px',
        fill: '#fff'
    }).setVisible(false); // Establecer como invisible

    // Guardar una referencia a la escena
    let self = this;

    // Después de 10 segundos, destruir imagen y mostrar cuadrícula
    this.time.delayedCall(10000, () => {
        if (animalesImage) {
            animalesImage.destroy();
        }
        if (contadorTexto) {
            contadorTexto.destroy();
        }
        cuentaRegresivaTimer.destroy();

        console.log('Intentando reproducir sonido para:', instrumentoActual); // Agrega este log
        this.sound.play(instrumentoActual);

        // Llamar a mostrarCuadriculaNivel2 usando la referencia guardada
        mostrarCuadriculaNivel2.call(self);

    }, [], this);
}

function mostrarCuadriculaNivel2() {
    console.log('Función mostrarCuadriculaNivel2 definida'); // Mensaje para verificar la definición

    // Hacer visible el texto de la pregunta
    if (textoPregunta) {
        textoPregunta.setVisible(true);
    }

    const filas = 3;
    const columnas = 3;
    const tamañoCelda = 150; // Ajusta el tamaño de las celdas
    const margenX = 350; // Ajusta el margen para centrar la cuadrícula 3x3
    const margenY = 170;
    const letrasFilas = ['A', 'B', 'C'];

    let maxSelecciones = 1; // Cada animal ocupa 1 celda

    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            const x = margenX + col * tamañoCelda;
            const y = margenY + fila * tamañoCelda;
            const idCelda = letrasFilas[fila] + (col + 1);

            let celda = this.add.rectangle(x + tamañoCelda / 2, y + tamañoCelda / 2, tamañoCelda, tamañoCelda, 0xffffff).setStrokeStyle(2, 0x00ff00);
            celda.setOrigin(0.5);
            celda.setInteractive();
            celda.setData('id', idCelda);
            celdasGrid[idCelda] = celda;

            console.log('Celda creada en:', idCelda, 'x:', x, 'y:', y); // Log para verificar la creación de celdas

            celda.on('pointerdown', () => {
                const id = celda.getData('id');
            
                if (!seleccionesJugador.includes(id) && seleccionesJugador.length < maxSelecciones) {
                    seleccionesJugador.push(id);
                    celda.setFillStyle(0xffff00);
            
                    // Verificar la respuesta inmediatamente después de la selección
                    for (const id in celdasGrid) {
                        celdasGrid[id].disableInteractive();
                    }
                    verificarRespuestaNivel2.call(this);
                }
            });
        }
    }
}

function verificarRespuestaNivel2() {
    // 🧹 Eliminar mensajes anteriores
    this.children.list.forEach(child => {
        if (child.text && (
            child.text.startsWith('¡Correcto!') ||
            child.text.startsWith('¡Incorrecto!') ||
            child.text.startsWith('Se acabaron los intentos.')
        )) {
            child.destroy();
        }
    });

    let acerto = false;
    console.log('Selección del jugador:', seleccionesJugador[0]);
    console.log('Ubicación correcta:', ubicacionesCorrectas[0]);
    if (seleccionesJugador.length === 1 && seleccionesJugador[0] === ubicacionesCorrectas[0]) {
        acerto = true;
    }

    // Mostrar feedback
    if (acerto) {
        this.add.text(300, 750, '¡Correcto! Pasando al Nivel 3...', { fontSize: '36px', fill: '#0f0' });

        seleccionesJugador.forEach(id => {
            if (celdasGrid[id]) {
                celdasGrid[id].setFillStyle(0x00ff00); // Verde si acierta
            }
        });

        // Eliminar imagen del Nivel 2
        if (animalesImage) {
            animalesImage.destroy();
            animalesImage = null; // Limpiar la referencia
        }

        // Limpiar la cuadrícula del Nivel 2
        for (const id in celdasGrid) {
            if (celdasGrid.hasOwnProperty(id)) {
                celdasGrid[id].destroy();
            }
        }
        celdasGrid = {}; // Reiniciar el objeto celdasGrid

        // Eliminar mensajes de error del Nivel 2 si existen
        this.children.list.forEach(child => {
            if (child.text && (
                child.text.startsWith('¡Incorrecto!') ||
                child.text.startsWith('Se acabaron los intentos.')
            )) {
                child.destroy();
            }
        });

        this.time.delayedCall(2000, () => {
            iniciarNivel3.call(this); // Llamamos a la función para iniciar el Nivel 3
        });

    

    } else {
        intentosRestantes--;
        intentosPorPregunta[`Nivel 2 - ${instrumentoActual}`]++; // Incrementar contador

        this.add.text(260, 620, '¡Incorrecto! Te quedan ' + intentosRestantes + ' intentos.', { fontSize: '36px', fill: '#f00' });

        seleccionesJugador.forEach(id => {
            if (celdasGrid[id]) {
                celdasGrid[id].setFillStyle(0xff0000); // Rojo si falla
            }
        });

        this.time.delayedCall(1000, () => {
            seleccionesJugador.forEach(id => {
                if (celdasGrid[id]) {
                    celdasGrid[id].setFillStyle(0xffffff); // Restaurar
                    celdasGrid[id].setInteractive(); // Reactivar
                }
            });
            seleccionesJugador = [];

            if (intentosRestantes === 0) {
                this.add.text(30, 680, 'Se acabaron los intentos. Vuelve a intentar el Nivel 2...', { fontSize: '36px', fill: '#f00' });
                this.time.delayedCall(3000, () => {
                    iniciarNivel2.call(this); // Volver a intentar el Nivel 2
                });
            } else {
                for (const idCelda in celdasGrid) {
                    celdasGrid[idCelda].setInteractive();
                }
            }
        });
    }}




// --------------------- Nivel 3: Instrumentos Musicales ---------------------
let instrumentosData = {
    'tambor': ['A1'],
    'triangulo': ['B1'],
    'violonchelo': ['D1', 'E1'],
    'piano': ['A2', 'A3', 'A4', 'B3'],
    'guitarra electrica': ['B2', 'C2', 'C3', 'D2', 'D3'],
    'xilofono': ['E2', 'E3'],
    'ukelele': ['D3', 'D4', 'E4'],
    'bateria': ['C4', 'C5'],
    'guitarra acustica': ['D5', 'E5'],
    'flauta': ['B4', 'B5'],
    'violin': ['A4', 'A5', 'B5']
};
let instrumentosArray = Object.keys(instrumentosData);
let instrumentosImage; // Para la imagen de instrumentos

function iniciarNivel3() {
    console.log('Iniciando Nivel 3: Instrumentos Musicales');
    intentosRestantes = 2;
    seleccionesJugador = [];
    celdasGrid = {}; // Limpiar el objeto de celdas
    instrumentoActual = Phaser.Math.RND.pick(instrumentosArray);
    ubicacionesCorrectas = instrumentosData[instrumentoActual];
    console.log('Instrumento a encontrar:', instrumentoActual, 'en las ubicaciones:', ubicacionesCorrectas); // Para pruebas

    intentosPorPregunta[`Nivel 3 - ${instrumentoActual}`] = 0;

    // Ocultar texto anterior si existe
    if (textoPregunta) {
        textoPregunta.setVisible(false);
    }

    // Mostrar imagen de instrumentos
    instrumentosImage = this.add.image(580, 400, 'instrumentos').setScale(0.8);

    // Texto de cuenta regresiva
    let contadorTexto = this.add.text(100, 100, '10', { fontSize: '48px', fill: '#fff' });
    let tiempoRestante = 10;

    // Crear el texto de la pregunta del Nivel 3 y hacerlo invisible inicialmente
    textoPregunta = this.add.text(340, 120, '¿Dónde estaba el ' + instrumentoActual + '?', {
        fontSize: '36px',
        fill: '#fff'
    }).setVisible(false); // Establecer como invisible (se hará visible en mostrarCuadricula())

    // Timer para actualizar el contador visualmente
    let cuentaRegresivaTimer = this.time.addEvent({
        delay: 1000,
        repeat: 9, // Se ejecutará 9 veces (para contar de 10 a 1)
        callback: () => {
            tiempoRestante--;
            contadorTexto.setText(tiempoRestante.toString());
        },
        callbackScope: this
    });

    // Llamada para mostrar la cuadrícula y reproducir el sonido después de 10 segundos
    this.time.delayedCall(10000, () => {
        console.log('¡Cuenta regresiva terminada, llamando a mostrarCuadricula y reproduciendo sonido!');
        if (instrumentosImage) {
            instrumentosImage.destroy();
        }
        if (contadorTexto) {
            contadorTexto.destroy();
        }
        this.sound.play(instrumentoActual); // Reproducir el sonido aquí
        mostrarCuadricula.call(this);
        cuentaRegresivaTimer.destroy(); // Detener el timer de la cuenta regresiva
    }, [], this);
}

function mostrarCuadricula() {
    // Hacer visible el texto de la pregunta
    if (textoPregunta) {
        textoPregunta.setVisible(true);
    }

    const filas = 5;
    const columnas = 5;
    const tamañoCelda = 100;
    const margenX = 320;
    const margenY = 160;
    const letrasFilas = ['A', 'B', 'C', 'D', 'E'];
    const ubicaciones = instrumentosData[instrumentoActual];

    // Determinar cuántas selecciones necesita el jugador hacer
    let maxSelecciones = 2;
    if (instrumentoActual === 'tambor' || instrumentoActual === 'triangulo') {
        maxSelecciones = 1;
    } else if (instrumentoActual === 'piano' || instrumentoActual === 'guitarra electrica') {
        maxSelecciones = 3;
    } else {
        maxSelecciones = 2;
    }

    for (let fila = 0; fila < filas; fila++) {
        for (let col = 0; col < columnas; col++) {
            const x = margenX + col * tamañoCelda;
            const y = margenY + fila * tamañoCelda;
            const idCelda = letrasFilas[fila] + (col + 1);

            let celda = this.add.rectangle(x + tamañoCelda / 2, y + tamañoCelda / 2, tamañoCelda, tamañoCelda, 0xffffff).setStrokeStyle(2, 0x00ff00);
            celda.setOrigin(0.5);
            celda.setInteractive();
            celda.setData('id', idCelda);
            celdasGrid[idCelda] = celda;

            celda.on('pointerdown', () => {
                const id = celda.getData('id');

                if (!seleccionesJugador.includes(id) && seleccionesJugador.length < maxSelecciones) {
                    seleccionesJugador.push(id);
                    celda.setFillStyle(0xffff00);

                    // Cuando el jugador alcanza el número requerido, verificar
                    if (seleccionesJugador.length === maxSelecciones) {
                        for (const id in celdasGrid) {
                            celdasGrid[id].disableInteractive();
                        }
                        verificarRespuesta.call(this);
                    }
                }
            });
        }
    }
}

function verificarRespuesta() {
    // 🧹 Eliminar mensajes anteriores
    this.children.list.forEach(child => {
        if (child.text && (
            child.text.startsWith('¡Correcto!') ||
            child.text.startsWith('¡Incorrecto!') ||
            child.text.startsWith('Se acabaron los intentos.')
        )) {
            child.destroy();
        }
    });

    let acerto = false;
    let numeroDeSeleccionesCorrectas = 0;

    // Ver cuántas selecciones son correctas
    seleccionesJugador.forEach(seleccion => {
        if (ubicacionesCorrectas.includes(seleccion)) {
            numeroDeSeleccionesCorrectas++;
        }
    });

    // Definir mínimo requerido para acertar
    let minimoCeldasParaAcertar = 1;
    if (instrumentoActual === 'ukelele' || instrumentoActual === 'flauta' || instrumentoActual === 'violin' || instrumentoActual === 'xilofono' || instrumentoActual === 'violonchelo' || instrumentoActual === 'guitarra acustica' || instrumentoActual === 'bateria') {
        minimoCeldasParaAcertar = 2;
    } else if (instrumentoActual === 'piano' || instrumentoActual === 'guitarra electrica') {
        minimoCeldasParaAcertar = 3;
    }

    if (numeroDeSeleccionesCorrectas >= minimoCeldasParaAcertar) {
        acerto = true;
    }

    // Mostrar feedback
    if (acerto) {
        this.add.text(400, 660, '¡Nivel 3 Completado!', { fontSize: '36px', fill: '#0f0' });

        seleccionesJugador.forEach(id => {
            if (celdasGrid[id]) {
                celdasGrid[id].setFillStyle(0x00ff00);
            }
        });

        this.time.delayedCall(3000, () => {
            // Limpiar la pantalla
            this.children.removeAll();

            // Mostrar las estadísticas
            let yOffset = 100;
            this.add.text(400, yOffset, 'Estadísticas del MiniJuego', { fontSize: '48px', fill: '#fff', align: 'center' }).setOrigin(0.5);
            yOffset += 60;

            for (const pregunta in intentosPorPregunta) {
                this.add.text(100, yOffset, `${pregunta}: ${intentosPorPregunta[pregunta]} errores)`, { fontSize: '32px', fill: '#fff' });
                yOffset += 40;
            }

            // Opcionalmente, agregar un botón para volver al inicio
            let volverInicioTexto = this.add.text(400, yOffset + 80, 'Volver al Inicio', { fontSize: '36px', fill: '#ffd700' }).setOrigin(0.5).setInteractive();
            volverInicioTexto.on('pointerdown', () => {
                this.scene.stop('NombreDeTuEscenaDelJuego');
                this.scene.start('PantallaInicio');
            });
        });

    } else {
        intentosRestantes--;
        intentosPorPregunta[`Nivel 3 - ${instrumentoActual}`]++; // Incrementar contador

        this.add.text(260, 680, '¡Incorrecto! Te quedan ' + intentosRestantes + ' intentos.', { fontSize: '36px', fill: '#f00' });

        seleccionesJugador.forEach(id => {
            if (celdasGrid[id]) {
                celdasGrid[id].setFillStyle(0xff0000); // Rojo si falla
            }
        });

        this.time.delayedCall(1000, () => {
            seleccionesJugador.forEach(id => {
                if (celdasGrid[id]) {
                    celdasGrid[id].setFillStyle(0xffffff); // Restaurar
                    celdasGrid[id].setInteractive(); // Reactivar
                }
            });
            seleccionesJugador = [];

            if (intentosRestantes === 0) {
                this.add.text(10, 710, 'Se acabaron los intentos, Intenta con otro instrumento...', { fontSize: '36px', fill: '#f00' });
                this.time.delayedCall(3000, () => {
                    iniciarNivel3.call(this);
                });
            } else {
                for (const idCelda in celdasGrid) {
                    celdasGrid[idCelda].setInteractive();
                }
            }
        });
    }
}