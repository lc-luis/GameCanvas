//Seleccionando el canvas para dibujar
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

//Crear la nave
var nave =
{
	x: 100,
	y: canvas.height - 70,
	width: 50,
	height: 50
}

//Eventos del teclado
var teclado = {};
var disparos = [];

//Definir variables para las imagenes
var fondo;

//Definir funciones
function loadMedia()
{
	fondo = new Image();
	fondo.src = "media/img/espacio.png";
	fondo.onload = function()
	{
		var intervalo = window.setInterval(frameLoop, 1000/55);
	}
}

function dibujarBackground()
{
	ctx.drawImage(fondo,0,0,800,400);
}

function dibujarNave()
{
	ctx.save();
	ctx.fillStyle = 'white';
	ctx.fillRect(nave.x, nave.y, nave.width, nave.height);
	ctx.restore();
}

function agregarEventosTeclado()
{	
	agregarEventos(document, "keydown", function(e)
	{
		//Ponemos en true la tecla presionada
		teclado[e.keyCode] = true;
		console.log(e.keyCode);
	});
	agregarEventos(document, "keyup", function(e)
	{
		//Ponemos en falso la tecla soltada
		teclado[e.keyCode] = false;
	});

	function agregarEventos(elemento, nombreEvento, funcion)
	{
		if (elemento.addEventListener) 
		{
			//Navegadores de verdad
			elemento.addEventListener(nombreEvento, funcion, false);
		} 
		else if(elemento.attachEvent)
		{
			//IExplorer
			elemento.attachEvent(nombreEvento, funcion);
		};
	}
}

function moverNave()
{
	if(teclado[37])//Flecha izquierda
	{
		//Movimiento a la izquierda
		nave.x -=10;
		if(nave.x < 0)
		{
			nave.x = 0;
		}
	}
	if(teclado[39])//Flecha derecha
	{
		//Movimiento a la derecha
		var limite = canvas.width - nave.width;
		nave.x +=10;
		if(nave.x > limite)
		{
			nave.x = limite;
		}
	}
	if(teclado[32])//Espacio
	{
		if(!teclado.fire)
		{
			//Disparo
			fire();
			teclado.fire = true;
		}	
	}
	else
	{
		teclado.fire = false;
	}
}

function moverDisparos()
{
	for(var i in disparos)
	{
		var disparo = disparos[i];
		disparo.y -= 2;
	}
	disparos = disparos.filter(function(disparo)
		{
			return disparo.y > 0;
		});
}

function fire()
{
	disparos.push
	({
		x: nave.x + 20,
		y: nave.y - 10,
		width: 10,
		height: 30
	});
}

function dibujarDisparos()
{
	ctx.save();
	ctx.fillStyle = "white";
	for(var i in disparos)
	{
		var disparo = disparos[i];
		ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);
	}
	ctx.restore()
}

function frameLoop()
{
	moverNave();
	moverDisparos();
	dibujarBackground();
	dibujarDisparos();
	dibujarNave();
}
//Ejecutando funciones
agregarEventosTeclado();
loadMedia();