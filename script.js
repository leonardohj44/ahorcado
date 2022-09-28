// variables globales
let palabras = [];
let tablero = document.getElementById("horca").getContext("2d");
document.getElementById("repetir-juego").style.display = "none";     // oculta btn-repetir
document.getElementById("salir-juego").style.display = "none";     // oculta btn-repetir
let palabraSecreta = '';
var tecla = '';
var letraExiste = false;
let txtI = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
let txtX = [];
const maxPalabra = 8;
var posX = [, , , , , , , , , , , , , , ,];
let ce = 0;   // contador de errores
var control = false;

// ----------- carga palabras de la API relacionadas con el texto escrito en 'inputTxt'  --------------
$('#btnAjax')[0].addEventListener('click', e => {
  let expresion = /[\u0300-\u036f]/g;
  let tema = $('#inputtxt').val();
  let existePalabra, i=0;
  console.log("===>>>", tema);
  try{
    $.get(`https://api.wordassociations.net/associations/v1.0/json/search?apikey=3a159612-66b3-4a19-97ad-88c1f0781e75&text=${tema}&lang=es`, response => {
      for (let i = 0, j = 0; i < 1000; i++) {
        existePalabra = response.response[0].items[i];
        if (existePalabra!==undefined) {
          let palabra = existePalabra.item.toUpperCase();
          palabras[i] = palabra.normalize("NFD").replace(expresion, "");    //NFD = Forma de Normalización de Descomposición Canónica.
          console.log("==========>", i, palabras[i])
        } // if
        else {
          if(i==0) {
            alert("Palabra no encontrada en la API, ingrese otra palabra.")
            window.location.reload();
          }
          break;
        }
      }
      document.getElementById("btnAjax").style.display = "none";   // oculta  btnAjax
    });
  } catch (err) {
    console.err(err)
  }
});

//  ------leer el teclado-----

function leerTecla(event) {
  if (control) {
    tecla = String.fromCharCode(event.which);
    if (tecla.match(/[a-zA-Z\s]+$/i)) {
      getLetter(tecla.toUpperCase());
    }
  }
}

function buscarPos(texto, buscar) {
  let pos = [];
  var textoImp = texto.split('').fill('', 0, texto.length);
  var txt = "";
  //console.log(textoImp)
  let c = 0;
  for (let i = 0; i < texto.length; i++) {
    if (texto.slice(i, buscar.length + i) === buscar) pos[c++] = i;
  }
  for (let p = 0; p < pos.length; p++)
    for (let i = 0; i < texto.length; i++)
      if (i === pos[p]) textoImp[i] = texto[i];
  return [pos, textoImp]
  //return textoImp;
}

function getLetter(valorTecla) {
  //let idxPos = [];    // indice de la posicion de la valorTecla encontrado en palabraSecreta
  let txtIprevio = [];
  let temp = [];
  let s = [];
  let f = palabraSecreta.split('').filter(x => x == valorTecla); // cantidad de valorTecla repetidos
  [s, temp] = buscarPos(txtI + '', valorTecla);
  //console.log(txtI);
  if (s.length !== 0) {
    console.log('letra ya existe');
    return null;
  }
  txtIprevio = txtI;
  if (f.length > 0) {  // valorTecla correcto
    [idxPos, txtIprevio] = buscarPos(palabraSecreta, valorTecla);
    //txtIprevio = buscarPos(palabraSecreta, valorTecla);

    for (let i = 0; i < palabraSecreta.length; i++)
      txtI[i] += txtIprevio[i];
    var txtOk;
    for (let j = 0; j < idxPos.length; j++) {
      txtOk = document.getElementById("letraI" + `${idxPos[j]}`);
      txtOk.style.position = 'absolute';
      txtOk.style.font = 'italic bold 60px arial';
      txtOk.style.color = '#00ff00';
      txtOk.style.marginTop = '560px';
      txtOk.style.marginLeft = (valorTecla === "I") ? `${posX[idxPos[j]] + 13}px` : `${posX[idxPos[j]]}px`;
      document.getElementById('letraI' + `${idxPos[j]}`).innerHTML = valorTecla;
    }
  }
  else {
    dibujarLineaHorca(++ce);
    var txtErrados = document.getElementById("letraX");
    txtErrados.style.position = 'absolute';
    txtErrados.style.font = 'italic bold 30px arial';
    txtErrados.style.color = '#ff0000';
    txtErrados.style.marginTop = '680px';
    txtErrados.style.marginLeft = '770px';
    txtX += valorTecla + " ";  // valorTecla errado
    document.getElementById('letraX').innerHTML = txtX;
  }
  if (txtI.join('') === palabraSecreta) mensaje(true); // ACERTÓ PALABRA SECRETA

} //getLetter()

//PalabraSecreta
function escojerPalabraSecreta() {
  let palabra = palabras[Math.floor(Math.random() * palabras.length)];
  palabraSecreta = palabra;
  return palabraSecreta
}

//Iniciar juego
function iniciarJuego() {
  document.getElementById("inputtxt").style.display = "none";   // oculta  inputTxt
  document.getElementById("btnAjax").style.display = "none";   // oculta  btnAjax
  document.getElementById("iniciar-juego").style.display = "none";       // 'none' = oculta ID
  document.getElementById("msgbox").style.display = "none";     // oculta msgbox
  document.getElementById("label").style.display = "none";     // oculta label
  document.getElementById("labellisto").style.display = "none";     // oculta label listo
  document.getElementById("repetir-juego").style.display = "block";     // oculta btn-repetir
  document.getElementById("salir-juego").style.display = "block";     // oculta btn-repetir
  control = true;
  txtX = [];
  document.getElementById('letraX').innerHTML = txtX;
  ce = 0;   // reinicio contador de errores
  txtI = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  
  escojerPalabraSecreta()
  dibujarCanvas()
  dibujarLineaLetras()
}

function repetirJuego() {
  let i = 0;
  while (i < 15) {
    document.getElementById(`letraI${i}`).innerHTML = "";
    i++;
  }
  iniciarJuego();
}
// ------------------------------ canvas ------------------------
function dibujarCanvas() {
  //tablero.clearRect()
  tablero.lineWidth = 8;
  tablero.lineCap = "round";
  tablero.lineJoin = "round";
  tablero.fillStyle = "#5533FF";      // color fondo del tablero
  tablero.strokeStyle = "#00FF00";    // color borde del trazo ahorcado
  tablero.fillRect(0, 0, 1366, 768);   // area de trabajo del canvas
  tablero.beginPath();
  tablero.moveTo(650, 500);
  tablero.lineTo(900, 500);
  tablero.stroke();
  tablero.closePath();
}

function drawline(xi, yi, xf, yf) {

  tablero.moveTo(xi, yi);
  tablero.lineTo(xf, yf);
}

function dibujarLineaHorca(err) {
  tablero.lineWidth = 8;
  tablero.lineCap = "round";
  tablero.lineJoin = "round";
  tablero.strokeStyle = "#00FF00";
  tablero.beginPath();
  switch (err) {
    case 1: drawline(700, 500, 700, 100); break;   // asta 1
    case 2: drawline(700, 100, 820, 100); break;   // asta 2
    case 3: drawline(820, 100, 820, 140); break;   // asta 3
    case 4: tablero.arc(820, 170, 30, 0, 2 * Math.PI, false); break;  // cabeza
    case 5: drawline(820, 200, 820, 300); break;   // tronco
    case 6: drawline(820, 205, 780, 230); break;   // brazo 1
    case 7: drawline(820, 205, 860, 230); break;   // brazo 2
    case 8: drawline(820, 300, 780, 330); break;   // pierna 1
    case 9: drawline(820, 300, 860, 330); mensaje(false); break;   // pierna 2
  } // switch()
  tablero.stroke();
  tablero.closePath();
}

function dibujarLineaLetras() {
  tablero.lineWidth = 6;
  tablero.lineCap = "round";
  tablero.lineJoin = "round";
  tablero.fillStyle = "#FF0000";
  tablero.strokeStyle = "#0A3871";
  let anchura = 800 / palabraSecreta.length;
  for (let i = 0; i < palabraSecreta.length; i++) {
    tablero.moveTo(500 + (anchura * i), 640)
    tablero.lineTo(550 + (anchura * i), 640)
    posX[i] = Math.round(670 + (anchura * i))    //guarda posicion para visualizar letras correctas
  }
  tablero.stroke();
  tablero.closePath();
}

function mensaje(success) {
  document.getElementById("msgbox").style.display = "block";
  control = false;
  if (success) {
    console.log(">>>>>>>>>>>>>GANASTES");
    document.getElementById('msgbox').innerHTML = 'Ganastes';
  } else {
    console.log(">>>>>>>>>>>>>PERDISTES");
    document.getElementById('msgbox').innerHTML = `Perdistes palabra secreta ${palabraSecreta}`;
  }
  document.getElementById("repetir-juego").style.display = "block";     // oculta btn-repetir
}