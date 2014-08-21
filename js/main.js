//Seleccionando el canvas para dibujar
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

//Variable JSON de estado del juego
var juego = 
{
	estado: 'iniciando'
}

var textoRespuesta = 
{
	contador: -1,
	titulo: '',
	subtitulo: ''
}
//Array que almacena los enemigos
var enemigos = [];

//Crear la nave
var nave =
{
	x: 100,
	y: canvas.height - 70,
	width: 50,
	height: 50,
	contador: 0
}

//Eventos del teclado
var teclado = {};
var disparos = [];
var disparosEnemigos = [];

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

function dibujarEnemigos()
{
	for(var i in enemigos)
	{
		var enemigo = enemigos[i];
		ctx.save();
		ctx.fillStyle = 'red';
		if(enemigo.estado == 'vivo')
		{
			ctx.fillStyle = 'red';
		}
		if(enemigo.estado == 'muerto')
		{
			ctx.fillStyle = 'black';
		}
		ctx.fillRect(enemigo.x, enemigo.y, enemigo.width, enemigo.height);
	}
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
	if(nave.estado == 'hit')
	{
		nave.contador++;
		if(nave.contador >= 20)
		{
			nave.contador = 0;
			nave.estado = 'muerto';
			juego.estado = 'perdido';
			textoRespuesta.titulo = 'Game Over';
			textoRespuesta.subtitulo = 'Presiona R para reiniciar';
			textoRespuesta.contador = 0;
		}
	}
}

function dibujarDisparosEnemigos()
{
	for(var i in disparosEnemigos)
	{
		disparo = disparosEnemigos[i];
		ctx.save();
		ctx.fillStyle = 'yellow';
		ctx.fillRect(disparo.x, disparo.y, disparo.width, disparo.height);
		ctx.restore();
	}
}

function actualizaEnemigos()
{
	function agregarDisparosEnemigos(enemigo)
	{
		return {
			x: enemigo.x,
			y: enemigo.y,
			width: 10,
			height: 33,
			contador: 0
		}
	}
	if(juego.estado == 'iniciando')
	{
		for(var i = 0; i < 10 ; i++)
		{
			enemigos.push({
				x: 10 + ( i * 50),
				y: 10,
				height: 40,
				width: 40,
				estado: 'vivo',
				contador: 0
			});
		}
		juego.estado = 'jugando';
	}
	for(var i in enemigos)
		{
			var enemigo = enemigos[i];
			if(!enemigo) continue;
			if(enemigo && enemigo.estado == 'vivo')
			{
				enemigo.contador++;
				enemigo.x += Math.sin(enemigo.contador * Math.PI / 90)*5;

				if(aleatorio(0,enemigos.length * 10) == 4)
				{
					disparosEnemigos.push(agregarDisparosEnemigos(enemigo));
				}
			}
			if(enemigo && enemigo.estado  == 'hit')
			{
				enemigo.contador++;
				if(enemigo.contador >= 20)
				{
					enemigo.estado = 'muerto';
					enemigo.contador = 0;
				}
			}
		}
		enemigos = enemigos.filter(function(enemigo){
			if(enemigo && enemigo.estado != 'muerto')
			{
				return true;
			}
			else
			{
				return false;
			}
		})
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

function moverDisparosEnemigos()
{
	for(var i in disparosEnemigos)
	{
		var disparo = disparosEnemigos[i];
		disparo.y += 3;
	}
	disparosEnemigos = disparosEnemigos.filter(function(disparo)
		{
			return disparo.y < canvas.height;
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

function hit(a,b)
{
	var hit = false;
	if(b.x + b.width >= a.x && b.x < a.x + a.width)
	{
		if(b.y + b.height >= a.y && b.y < a.y + a.height)
		{
			hit = true;
		}
	}
	if(b.x <= a.x && b.x + b.width >= a.x + a.width)
	{
		if(b.y <= a.y && b.y + b.height >= a.y + a.height)
		{
			hit = true;
		}
	}
	if(a.x <= b.x && a.x + a.width >= b.x + b.width)
	{
		if(a.y <= b.y && a.y + a.height >= b.y + b.height)
		{
			hit = true;
		}
	}
	return hit;
}

function verificarContacto()
{
	for(var i in disparos)
	{
		var disparo = disparos[i];
		for(j in enemigos)
		{
			var enemigo = enemigos[j];
			if(hit(disparo,enemigo))
			{
				enemigo.estado = 'hit';
				enemigo.contador = 0;
			}
		}
	}
	if(nave.estado == 'hit' || nave.estado == 'muerto')
	{
		return;
	}
	else
	{
		for (var i in disparosEnemigos)
		{
			var disparo = disparosEnemigos[i];
			if(hit(disparo,nave))
			{
				nave.estado = 'hit';
			}
		}
	} 
}

function dibujaTexto()
{
	if(textoRespuesta.contador == -1)
	{
		return;
	}
	else
	{
		var alpha = textoRespuesta.contador/50.0;
		if(alpha > 1)
		{
			for(var i in enemigos)
			{
				delete enemigos[i];
			}
		}
	}
	ctx.save();
	ctx.globalAlpha = alpha;
	if(juego.estado == 'perdido')
	{
		ctx.fillStyle = 'white';
		ctx.font = 'Bold 40pt Arial';
		ctx.fillText(textoRespuesta.titulo, 140, 200);
		ctx.font = '14pt Arial';
		ctx.fillText(textoRespuesta.subtitulo, 190, 250);
	}
	if(juego.estado == 'victoria')
	{
		ctx.fillStyle = 'white';
		ctx.font = 'Bold 40pt Arial';
		ctx.fillText(textoRespuesta.titulo, 70, 200);
		ctx.font = '14pt Arial';
		ctx.fillText(textoRespuesta.subtitulo, 300, 250);
	}
}

function actualizarEstadoJuego()
{
	if(juego.estado == 'jugando' && enemigos.length == 0)
	{
		juego.estado = 'victoria';
		textoRespuesta.titulo = 'Derrotaste a los enemigos';
		textoRespuesta.subtitulo = 'Pulsa R para reiniciar';
		textoRespuesta.contador = 0;
	}
	if(textoRespuesta.contador >= 0)
	{
		textoRespuesta.contador++;
	}
	if((juego.estado == 'perdido' || juego.estado == 'victoria') && teclado[82])
	{
		juego.estado = 'iniciando';
		nave.estado = 'vivo';
		textoRespuesta.contador = -1;
	}
}


function aleatorio(minimo, maximo)
{
	var numero = maximo - minimo;
	var a = Math.random() * numero;
	a = Math.floor(a);
	return parseInt( minimo + a );
}

function frameLoop()
{
	actualizarEstadoJuego();
	moverNave();
	actualizaEnemigos();
	moverDisparos();
	dibujarBackground();
	verificarContacto();
	dibujarDisparos();
	dibujarNave();
	dibujarEnemigos();
	dibujarDisparosEnemigos();
	moverDisparosEnemigos();
	dibujaTexto();
}
//Ejecutando funciones
agregarEventosTeclado();
loadMedia();