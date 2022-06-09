let tableSizeX1 = 1, //Almacena el valor en X de la matriz 1
    tableSizeY1 = 1, //Almacena el valor en Y de la matriz 1
    tableSizeX2 = 1, //Almacena el valor en X de la matriz 2
    tableSizeY2 = 1, //Almacena el valor en Y de la matriz 2
    sizeY1M = 1, //Valor referencial para mostrar la complejidad de la matriz
    sizeY2M = 1,
    sizeX1M = 1,
    sizeX2M = 1,
    matrixComplexity = 0, //Total de la complejiddad de la matriz
    ma = false, //No recuerdo en qué se usa xd
    strs = false, //Se usa para saber si se usó el método strassen, si es false es que no se usó
    tableValues = new Array(), //Matriz 1
    tableValues2 = new Array(), //Matriz 2
    tableResult = new Array(), //Result
    timeStrassen = 0, //Tiempo que le tomó hacer el método de strassen
    timeBrute = 0, //Tiempo que le tomó hacer el método de fuerza bruta
    operations = 0, //Cantidad de operaciones realizadas
    tt = 0, //Variable temporal para las gráficas
    divsIds = new Array(), //Arreglo para poder llenar los valores de las tablas en la animación de strassen
    memoryUsedStPre = 0; //Variable hecha para calcular la cantidad de variables usadas a lo largo del procedimiento de strassen

//Función para desaparecer con efecto fade un objeto
function fade(element) {
    if (element != null && element != undefined && element != NaN) {
        let op = 1;
        let timer = setInterval(function() {
            if (op <= 0.1) {
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 50);
    }
}

//Función para aparecer con efecto fade un objeto
function unfade(element) {
    if (element != null && element != undefined && element != NaN) {
        let op = 0.1;
        element.style.display = 'block';
        let timer = setInterval(function() {
            if (op >= 1) {
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 10);
    }
}
//Función usada para ocultar el menú principal
function menu() {
    fade(document.getElementById('beginbtn'));
}

//Función para imprimir la gráfica de tiempo/operaciones mediante fuerza bruta
function drawGraph(dataArr) {
    var canvas = document.getElementById("Canvas");
    var context = canvas.getContext("2d");

    var GRAPH_TOP = 25;
    var GRAPH_BOTTOM = 375;
    var GRAPH_LEFT = 25;
    var GRAPH_RIGHT = 475;

    var GRAPH_HEIGHT = 350;
    var GRAPH_WIDTH = 450;

    var arrayLen = dataArr.length;
    var largest = 0;
    for (var i = 0; i < arrayLen; i++) {
        if (dataArr[i] > largest) {
            largest = dataArr[i];
        }
    }

    context.clearRect(0, 0, 500, 400);
    // set font for fillText()
    context.font = "16px Arial";

    // draw X and Y axis
    context.beginPath();
    context.moveTo(GRAPH_LEFT, GRAPH_BOTTOM);
    context.lineTo(GRAPH_RIGHT, GRAPH_BOTTOM);
    context.lineTo(GRAPH_RIGHT, GRAPH_TOP);
    context.stroke();

    // draw reference line
    context.beginPath();
    context.strokeStyle = "#BBB";
    context.moveTo(GRAPH_LEFT, GRAPH_TOP);
    context.lineTo(GRAPH_RIGHT, GRAPH_TOP);
    // draw reference value for hours
    context.fillText(largest, GRAPH_RIGHT + 15, GRAPH_TOP);
    context.stroke();

    // draw reference line
    context.beginPath();
    context.moveTo(GRAPH_LEFT, (GRAPH_HEIGHT) / 4 * 3 + GRAPH_TOP);
    context.lineTo(GRAPH_RIGHT, (GRAPH_HEIGHT) / 4 * 3 + GRAPH_TOP);
    // draw reference value for hours  
    context.fillText(largest / 4, GRAPH_RIGHT + 15, (GRAPH_HEIGHT) / 4 * 3 + GRAPH_TOP);
    context.stroke();

    // draw reference line  
    context.beginPath();
    context.moveTo(GRAPH_LEFT, (GRAPH_HEIGHT) / 2 + GRAPH_TOP);
    context.lineTo(GRAPH_RIGHT, (GRAPH_HEIGHT) / 2 + GRAPH_TOP);
    // draw reference value for hours  
    context.fillText(largest / 2, GRAPH_RIGHT + 15, (GRAPH_HEIGHT) / 2 + GRAPH_TOP);
    context.stroke();

    // draw reference line  
    context.beginPath();
    context.moveTo(GRAPH_LEFT, (GRAPH_HEIGHT) / 4 + GRAPH_TOP);
    context.lineTo(GRAPH_RIGHT, (GRAPH_HEIGHT) / 4 + GRAPH_TOP);
    // draw reference value for hours  
    context.fillText(largest / 4 * 3, GRAPH_RIGHT + 15, (GRAPH_HEIGHT) / 4 + GRAPH_TOP);
    context.stroke();

    // draw titles 
    if (timeBrute > 1000) context.fillText("Tiempo (s)", GRAPH_RIGHT / 3, GRAPH_BOTTOM + 50);
    else context.fillText("Tiempo (ms)", GRAPH_RIGHT / 3, GRAPH_BOTTOM + 50);
    context.fillText("  Operaciones", GRAPH_RIGHT + 30, GRAPH_HEIGHT / 2);

    context.beginPath();
    context.lineJoin = "round";
    context.strokeStyle = "black";

    context.moveTo(GRAPH_LEFT, (GRAPH_HEIGHT - dataArr[0] / largest * GRAPH_HEIGHT) + GRAPH_TOP);
    // draw reference value for day of the week  
    let times;
    if (timeBrute > 1000) times = (timeBrute / 1000) / 10;
    else times = timeBrute / 10;
    context.fillText("0 ", 15, GRAPH_BOTTOM + 25);
    for (var i = 1; i < arrayLen; i++) {
        context.lineTo(GRAPH_RIGHT / arrayLen * i + GRAPH_LEFT, (GRAPH_HEIGHT - dataArr[i] / largest * GRAPH_HEIGHT) + GRAPH_TOP);
        // draw reference value for day of the week  
        let x = (i + 1) * times;
        x = x.toFixed(2);
        context.fillText(x, GRAPH_RIGHT / arrayLen * i, GRAPH_BOTTOM + 25);
    }
    context.stroke();
}

//Función para imprimir la gráfica de tiempo/operaciones mediante strassen
function drawGraph1(dataArr) {
    var canvas = document.getElementById("Canvas1");
    var context = canvas.getContext("2d");
    var GRAPH_TOP = 25;
    var GRAPH_BOTTOM = 375;
    var GRAPH_LEFT = 25;
    var GRAPH_RIGHT = 475;

    var GRAPH_HEIGHT = 350;
    var GRAPH_WIDTH = 450;

    var arrayLen = dataArr.length;

    var largest = 0;
    for (var i = 0; i < arrayLen; i++) {
        if (dataArr[i] > largest) {
            largest = dataArr[i];
        }
    }

    context.clearRect(0, 0, 500, 400);
    // set font for fillText()
    context.font = "16px Arial";

    // draw X and Y axis
    context.beginPath();
    context.moveTo(GRAPH_LEFT, GRAPH_BOTTOM);
    context.lineTo(GRAPH_RIGHT, GRAPH_BOTTOM);
    context.lineTo(GRAPH_RIGHT, GRAPH_TOP);
    context.stroke();

    // draw reference line
    context.beginPath();
    context.strokeStyle = "#BBB";
    context.moveTo(GRAPH_LEFT, GRAPH_TOP);
    context.lineTo(GRAPH_RIGHT, GRAPH_TOP);
    // draw reference value for hours
    context.fillText(largest, GRAPH_RIGHT + 15, GRAPH_TOP);
    context.stroke();

    // draw reference line
    context.beginPath();
    context.moveTo(GRAPH_LEFT, (GRAPH_HEIGHT) / 4 * 3 + GRAPH_TOP);
    context.lineTo(GRAPH_RIGHT, (GRAPH_HEIGHT) / 4 * 3 + GRAPH_TOP);
    // draw reference value for hours  
    context.fillText(largest / 4, GRAPH_RIGHT + 15, (GRAPH_HEIGHT) / 4 * 3 + GRAPH_TOP);
    context.stroke();

    // draw reference line  
    context.beginPath();
    context.moveTo(GRAPH_LEFT, (GRAPH_HEIGHT) / 2 + GRAPH_TOP);
    context.lineTo(GRAPH_RIGHT, (GRAPH_HEIGHT) / 2 + GRAPH_TOP);
    // draw reference value for hours  
    context.fillText(largest / 2, GRAPH_RIGHT + 15, (GRAPH_HEIGHT) / 2 + GRAPH_TOP);
    context.stroke();

    // draw reference line  
    context.beginPath();
    context.moveTo(GRAPH_LEFT, (GRAPH_HEIGHT) / 4 + GRAPH_TOP);
    context.lineTo(GRAPH_RIGHT, (GRAPH_HEIGHT) / 4 + GRAPH_TOP);
    // draw reference value for hours  
    context.fillText(largest / 4 * 3, GRAPH_RIGHT + 15, (GRAPH_HEIGHT) / 4 + GRAPH_TOP);
    context.stroke();

    // draw titles 
    if (timeStrassen > 1000) context.fillText("Tiempo (s)", GRAPH_RIGHT / 3, GRAPH_BOTTOM + 50);
    else context.fillText("Tiempo (ms)", GRAPH_RIGHT / 3, GRAPH_BOTTOM + 50);
    context.fillText("  Operaciones", GRAPH_RIGHT + 30, GRAPH_HEIGHT / 2);

    context.beginPath();
    context.lineJoin = "round";
    context.strokeStyle = "black";

    context.moveTo(GRAPH_LEFT, (GRAPH_HEIGHT - dataArr[0] / largest * GRAPH_HEIGHT) + GRAPH_TOP);
    // draw reference value for day of the week  
    context.fillText("0 ", 15, GRAPH_BOTTOM + 25);
    let times;
    if (timeStrassen > 1000) times = (timeStrassen / 1000) / 10;
    else times = (timeStrassen) / 10;
    for (var i = 1; i < arrayLen; i++) {
        context.lineTo(GRAPH_RIGHT / arrayLen * i + GRAPH_LEFT, (GRAPH_HEIGHT - dataArr[i] / largest * GRAPH_HEIGHT) + GRAPH_TOP);
        // draw reference value for day of the week  
        let x = (i + 1) * times;
        x = x.toFixed(2);
        context.fillText(x, GRAPH_RIGHT / arrayLen * i, GRAPH_BOTTOM + 25);
    }
    context.stroke();
}

//Función que en base a una escala (el tamaño de la matriz) se determina un meme, a mayor la escala, sale un meme más turbio
function photos(y) {
    if (y < 50) {
        document.getElementById('im0').style.display = 'block';
        for (let i = 0; i < 11; i++) {
            let id = "im" + i;
            if (i != 0) document.getElementById(id).style.display = 'none';
        }
    } else if (y > 50 && y <= 120) {
        document.getElementById('im1').style.display = 'block';
        for (let i = 0; i < 11; i++) {
            let id = "im" + i;
            if (i != 1) document.getElementById(id).style.display = 'none';
        }
    } else if (y > 120 && y <= 440) {
        document.getElementById('im2').style.display = 'block';
        for (let i = 0; i < 11; i++) {
            let id = "im" + i;
            if (i != 2) document.getElementById(id).style.display = 'none';
        }
    } else if (y > 440 && y <= 980) {
        document.getElementById('im3').style.display = 'block';
        for (let i = 0; i < 11; i++) {
            let id = "im" + i;
            if (i != 3) document.getElementById(id).style.display = 'none';
        }
    } else if (y > 980 && y <= 1200) {
        document.getElementById('im4').style.display = 'block';
        for (let i = 0; i < 11; i++) {
            let id = "im" + i;
            if (i != 4) document.getElementById(id).style.display = 'none';
        }
    } else if (y > 1200 && y <= 1500) {
        document.getElementById('im5').style.display = 'block';
        for (let i = 0; i < 11; i++) {
            let id = "im" + i;
            if (i != 5) document.getElementById(id).style.display = 'none';
        }
    } else if (y > 1500 && y <= 1900) {
        document.getElementById('im6').style.display = 'block';
        for (let i = 0; i < 11; i++) {
            let id = "im" + i;
            if (i != 6) document.getElementById(id).style.display = 'none';
        }
    } else if (y > 1900 && y <= 2000) {
        document.getElementById('im7').style.display = 'block';
        for (let i = 0; i < 11; i++) {
            let id = "im" + i;
            if (i != 7) document.getElementById(id).style.display = 'none';
        }
    } else if (y > 2000 && y <= 2500) {
        document.getElementById('im8').style.display = 'block';
        for (let i = 0; i < 11; i++) {
            let id = "im" + i;
            if (i != 8) document.getElementById(id).style.display = 'none';
        }
    } else if (y > 2500 && y <= 3000) {
        document.getElementById('im9').style.display = 'block';
        for (let i = 0; i < 11; i++) {
            let id = "im" + i;
            if (i != 9) document.getElementById(id).style.display = 'none';
        }
    } else {
        document.getElementById('im10').style.display = 'block';
        for (let i = 0; i <= 10; i++) {
            let id = "im" + i;
            if (i != 10) document.getElementById(id).style.display = 'none';
        }
    }
}

//Obtiene el tamaño en Y de la matriz 1 cuando se ingresa una matriz de NxM
function GetNumbery1(form) {
    sizeY1M = form.sizey1.value;
}

//Obtiene el tamaño en Y de la matriz 2 cuando se ingresa una matriz de NxM
function GetNumbery2(form) {
    sizeY2M = form.sizey2.value;
}

//Obtiene el tamaño en X de la matriz 2 cuando se ingresa una matriz de NxM
function GetNumberx2(form) {
    sizeX2M = form.sizex2.value;
}

//Obtiene el tamaño en X de la matriz 1 cuando se ingresa una matriz de NxM
function GetNumberx1(form) {
    sizeX1M = form.sizex1.value;
}

//Función principal que invoca los memes para medir la complejidad de la matriz
function testing(form, val) {
    if (val) sizeX1M = form.sizex1.value;
    else sizeX2M = form.sizex2.value;
    let matrixComplexity1 = (sizeX1M * sizeY1M) + (sizeX2M * sizeY2M);
    if (matrixComplexity1 >= 100000) {
        alert("Estas seguro de querer continuar?");
    }
    matrixComplexity = matrixComplexity1;
    photos(matrixComplexity1 * 3);

}

//Genera una matriz ya sea automática o manual con base al parámetro "condition", si éste es "auto" se dice que la matriz 
//se generará una matriz automáticamente y con valores aleatorios entre 0 y la suma del tamaño de la altura de la matriz 2 y la longitud de la matriz 1
//en caso de que no sea "auto" se generará una matriz con celdas con un cuadro de input para colocar los valores de la matriz
// y éste será generado y desplegado en la página principal
function createTable(condition, tableSizeX, tableSizeY, table) {
    document.getElementById('forms').style.display = "none";
    let id = "table" + table;
    let divs = document.getElementById(id);
    let tables;
    if (condition == "auto") {
        let columns = "";
        for (let i = 0; i < tableSizeY; i++) {
            let cols = new Array();
            columns += "<tr>";
            for (let j = 0; j < tableSizeX; j++) {
                let ran = Math.floor(Math.random() * (tableSizeX1 + tableSizeY2));
                if (ran == 0) ran++;
                columns += "<td>" + ran + "</td>";
                cols.push(ran);
            }
            columns += "</tr>";
            if (!ma) {
                tableValues.push(cols);
            } else {
                tableValues2.push(cols);
            }
        }
        if (!ma) ma = true;
        tables = "<div class='col'><table class='table table-stripped table-info'><tbody>" + columns + "</tbody></table></div>";
    } else {

        let columns = "";
        for (let i = 0; i < tableSizeY; i++) {
            columns += "<tr>";
            for (let j = 0; j < tableSizeX; j++) {
                columns += "<td><input required type='number' id='" + "col" + i + "_" + j + "_" + table + "'/></td>";
            }
            columns += "</tr>";
        }
        tables = "<center><form method='post' id='tableF" + table + "'><table class='table table-info table-responsive'><tbody>" + columns + "</table></tbody>";
        tables += "<input type='button' class='btn btn-info' value='cargar' onclick='loadTable(this.form," + table + ")'/></form></center>";
    }
    if (tableSizeX <= 256) divs.innerHTML = tables;
}

//Función para ingresar una tabla manual en el programa cuando el usuario lo deseé
function manualTable(tableSizeX, tableSizeY, table) {
    let columns = "";
    document.getElementById('forms').style.display = "none";
    let id = "table" + table;
    let divs = document.getElementById(id);
    for (let i = 0; i < tableSizeY; i++) {
        columns += "<tr>";
        for (let j = 0; j < tableSizeX; j++) {
            columns += "<td><input type='number' id='" + "col" + i + "_" + j + "_" + table + "'/></td>";
        }
        columns += "</tr>";
    }
    tables = "<center><form method='post' id='tableF" + table + "'><table class='table table-info table-responsive'><tbody>" + columns + "</table></tbody>";
    tables += "<input type='button' class='btn btn-info' value='cargar' onclick='loadTable(this.form," + table + ")'/></form></center>";
    divs.innerHTML = tables;
}

//Oculta los objetos que ya no son necesarios cuando se da la instrucción, en este caso despliega el menú para ingresar una matriz NxM
function nmTable() {
    document.getElementById('firstAction').style.display = "none";
    document.getElementById('colMN').style.display = 'block';
}

//Oculta los objetos que ya no son necesarios cuando se da la instrucción, en este caso despliega el menú para ingresar una matriz NxN
function nnTable() {
    document.getElementById('firstAction').style.display = "none";
    document.getElementById('colMC').style.display = 'block';
}

//Carga las tablas ingresadas por el usuario en el código para ser almacenadas
function loadTable(form, table) {
    let elements = form.elements;
    if (tableValues.length == 0 && tableValues2.length == 0) {
        if (table == 0) {
            let k = 0;
            for (let i = 0; i < tableSizeY1; i++) {
                let cols = new Array();
                for (let j = 0; j < tableSizeX1; j++, k++) {
                    let ele = parseInt(elements[k].value);
                    cols.push(ele);
                }
                tableValues.push(cols);
            }
            for (let i = 0; i < tableSizeY2; i++) {
                let cols = new Array();
                for (let j = 0; j < tableSizeX2; j++, k++) {
                    let ele = parseInt(elements[k].value);
                    cols.push(ele);
                }
                tableValues2.push(cols);
            }
        } else
        if (table == 1) {
            for (let i = 0, k = 0; i < tableSizeY1; i++) {
                let cols = new Array();
                for (let j = 0; j < tableSizeX1; j++, k++) {
                    let ele = parseInt(elements[k].value);
                    cols.push(ele);
                }
                tableValues.push(cols);
            }
        } else {
            for (let i = 0, k = 0; i < tableSizeY2; i++) {
                let cols = new Array();
                for (let j = 0; j < tableSizeX2; j++, k++) {
                    let ele = parseInt(elements[k].value);
                    cols.push(ele);
                }
                tableValues2.push(cols);
            }
        }
    } else
        for (let i = 0, k = 0; i < tableSizeY2; i++) {
            let cols = new Array();
            for (let j = 0; j < tableSizeX2; j++, k++) {
                let ele = parseInt(elements[k].value);
                cols.push(ele);
            }
            tableValues2.push(cols);
        }
    lockTables();
}

//Caso especial cuando se dice que el usuario dará ambas matrices
function manualTables() {
    document.getElementById('forms').style.display = "none";
    let x = document.getElementById('inputTables');
    x.innerHTML = "<div id='ff'><form id='ftables' method='post'><div id='table1'></div><div id='table2'></div><br><input type='button' value='Cargar tablas' class='btn btn-info' onClick='loadTable(this.form,0)'/></form></div>"
    let id1 = "table1";
    let id2 = "table2";
    let divs = document.getElementById(id1);
    let divs2 = document.getElementById(id2);
    let columns = "";
    let tables;
    let tables1;
    //table 1
    for (let i = 0; i < tableSizeY1; i++) {
        columns += "<tr>";
        for (let j = 0; j < tableSizeX1; j++) {
            columns += "<td><input type='number' name='" + "col" + i + "_" + j + "_1'/></td>";
        }
        columns += "</tr>";
    }
    tables = "<table class='table table-info table-responsive'><tbody>" + columns + "</table></tbody>";
    columns = "";
    //table 2
    for (let i = 0; i < tableSizeY2; i++) {
        columns += "<tr>";
        for (let j = 0; j < tableSizeX2; j++) {
            columns += "<td><input type='number' name='" + "col" + i + "_" + j + "_2'/></td>";
        }
        columns += "</tr>";
    }
    tables1 = "<table class='table table-info table-responsive'><tbody>" + columns + "</table></tbody>";
    divs.innerHTML = tables;
    divs2.innerHTML = tables1;
}

//Ajusta y guarda el tamaño de las matrices que se usarán
function setSize(form, x) {
    if (x) {
        tableSizeX1 = form.sizex1.value;
        tableSizeY1 = form.sizex1.value;
        tableSizeX2 = form.sizex2.value;
        tableSizeY2 = form.sizex2.value;
    } else {
        tableSizeX1 = form.sizex1.value;
        tableSizeY1 = form.sizey1.value;
        tableSizeX2 = form.sizex2.value;
        tableSizeY2 = form.sizey2.value;
    }
    let tp1 = form.type1.value;
    let tp2 = form.type2.value;
    if (tp1 == tp2 && tp1 == "manual") {
        manualTables();
    } else if (tp1 == "manual" && tp2 == "auto") {
        manualTable(tableSizeX1, tableSizeY1, 1);
        createTable(tp2, tableSizeX2, tableSizeY2, 2);
    } else if (tp2 == "manual" && tp1 == "auto") {
        manualTable(tableSizeX2, tableSizeY2, 2);
        createTable(tp1, tableSizeX1, tableSizeY1, 1);
    } else {
        createTable(tp1, tableSizeX1, tableSizeY1, 1);
        createTable(tp2, tableSizeX2, tableSizeY2, 2);
        lockTables();
    }
}

function verifyPot(size) {
    let pot = 0;
    for (let i = 0; pot < size; i++) {
        pot = Math.pow(2, i);
        if (pot == size) return true;
    }
    return false;
}
//Verifica el tipo de matriz, si es Cuadrada, cuadrada 2^n o NxM
function verifyTypeMatrix(matrix) {
    if (matrix[0].length == matrix.length) {
        if (matrix.length % 2 == 0 && (matrix.length * matrix.length) % 2 == 0 && verifyPot(Math.pow(matrix.length, 2))) {
            return "p2";
        } else {
            return "cd";
        }
    } else return "nm";
}

//Crea una Id aleatoria para lo que se necesite
function createRandId(index) {
    let y = Math.random() % (10000 + 1);
    let x = index + y;
    return x;
}

//Genera el formato html de la tabla que se anexará al padre de ella
function getMatrix(A, index, otable, table) {
    let ids = new Array();
    for (let i = 0; i < A.length; i++) {
        let x = document.createElement('tr');
        for (let j = 0; j < A.length; j++) {
            let y = document.createElement('td');
            let id = "col_" + i + "_" + j + "_" + createRandId(index) + "_" + otable;
            y.setAttribute('id', id);
            ids.push(id);
            x.appendChild(y);
        }
        table.appendChild(x);
    }
    let ret = {
        first: table,
        second: ids
    };
    return ret;
}

//Tras generar las matrices en formato html las genera sin datos, esta función le da sus respectivos valores
function dropValues(A, ids) {
    let x = 0;
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A.length; j++, x++) {
            document.getElementById(ids[x]).innerHTML = A[i][j];
        }
    }
}

//Crea submatrices de la tabla A, con un identificador que se guarda en divIds, la cual se usa en la función unHideMatrixes;
//el parámetro Index, es meramente informativo para generar un nombre
//Otable permite saber quien es el padre de la submatriz
function createSubMatrixes(A, id, index, otable, son1, son2, son3, son4) {
    if (A.length > 1) {
        let div1 = document.createElement('div'),
            div2 = document.createElement('div'),
            div3 = document.createElement('div'),
            div4 = document.createElement('div'),
            div5 = document.createElement('div'),
            div6 = document.createElement('div'),
            div7 = document.createElement('div'),
            div8 = document.createElement('div'),
            table1 = document.createElement('table'),
            table2 = document.createElement('table'),
            table3 = document.createElement('table'),
            table4 = document.createElement('table'),
            halfA = A.length / 2,
            m11 = getSubMatrix(A, 0, halfA, 0, halfA),
            m12 = getSubMatrix(A, halfA, A.length, 0, halfA),
            m21 = getSubMatrix(A, 0, halfA, halfA, A.length),
            m22 = getSubMatrix(A, halfA, A.length, halfA, A.length),
            father = document.getElementById(id),
            idDiv1 = ("subt_" + createRandId(index)) + "_" + 0,
            idDiv2 = ("subt_" + createRandId(index) + 1) + "_" + 1,
            idDiv3 = ("subt_" + createRandId(index) + 2) + "_" + 2,
            idDiv4 = ("subt_" + createRandId(index) + 3) + "_" + 3,
            tableClass = "table table-responsive table-",
            divClass = "col table",
            div2Class = "row",
            a, b, c, d;
        divsIds.push(idDiv1);
        divsIds.push(idDiv2);
        divsIds.push(idDiv3);
        divsIds.push(idDiv4);
        table1.setAttribute('class', tableClass + son1);
        table2.setAttribute('class', tableClass + son2);
        table3.setAttribute('class', tableClass + son3);
        table4.setAttribute('class', tableClass + son4);
        div1.setAttribute('id', idDiv1);
        div2.setAttribute('id', idDiv2);
        div3.setAttribute('id', idDiv3);
        div4.setAttribute('id', idDiv4);
        div1.setAttribute('class', divClass);
        div2.setAttribute('class', divClass);
        div3.setAttribute('class', divClass);
        div4.setAttribute('class', divClass);
        div5.setAttribute('class', div2Class);
        div6.setAttribute('class', div2Class);
        div7.setAttribute('class', div2Class);
        div8.setAttribute('class', div2Class);
        a = getMatrix(m11, index, (otable + "_A"), table1);
        b = getMatrix(m12, index + 1, (otable + "_B"), table2);
        c = getMatrix(m21, index + 2, (otable + "_C"), table3);
        d = getMatrix(m22, index + 3, (otable + "_D"), table4);
        div1.appendChild(a.first);
        div2.appendChild(b.first);
        div3.appendChild(c.first);
        div4.appendChild(d.first);
        div5.appendChild(div1);
        div5.appendChild(div2);
        div5.appendChild(div3);
        div5.appendChild(div4);
        father.appendChild(div5);
        fade(div1);
        dropValues(m11, a.second);
        fade(div2);
        dropValues(m12, b.second);
        fade(div3);
        dropValues(m21, c.second);
        fade(div4);
        dropValues(m22, d.second);
        createSubMatrixes(m11, idDiv1, index + 1, otable, son1, son2, son3, son4);
        createSubMatrixes(m12, idDiv2, index + 2, otable, son1, son2, son3, son4);
        createSubMatrixes(m21, idDiv3, index + 3, otable, son1, son2, son3, son4);
        createSubMatrixes(m22, idDiv4, index + 4, otable, son1, son2, son3, son4);
    }
}

//Revela las tablas que fueron ocultadas para las animaciones
function unHideMatrixes() {
    let timer = 1000;
    for (let i = 0; i < divsIds.length; i++, timer += 1000) {
        setTimeout(() => { unfade(document.getElementById(divsIds[i])); }, timer);
    }
}

//Genera una cadena con el código de una tabla html basada en la matriz que se le da
function printTable(A) {
    let n = A.length;
    let m = A[0].length;
    let table = "<div class='table-responsive'><table class='table table-striped table-info'><tbody>";
    for (let i = 0; i < n; i++) {
        table += "<tr>";
        for (let j = 0; j < m; j++) {
            table += "<td>" + A[i][j] + "</td>";
        }
        table += "</tr>";
    }
    table += "</tbody></table></div></div>";
    return table;
}

function printTable1(A) {
    let n = A.length;
    let m = A[0].length;
    let table = "<div class='table-responsive'><table class='table'><tbody>";
    for (let i = 0; i < n; i++) {
        table += "<tr>";
        for (let j = 0; j < m; j++) {
            let td = "<td";
            if (j < (m / 2) && i < (n / 2)) td += " class='table-primary'>";
            else if (j >= (m / 2) && i < (n / 2)) td += " class='table-secondary'>";
            else if (j < (m / 2) && i >= (n / 2)) td += " class='table-success'>";
            else td += " class='table-warning'>";
            table += td + A[i][j] + "</td>";
        }
        table += "</tr>";
    }
    table += "</tbody></table></div></div>";
    return table;
}
//Crea la animación de segmentar la matrix de X tabla
//Se le da la Tabla A y posteriormente la id del DIV dónde se guarda el padre y la id que se le quiere dar
function matrixSegmentationAnimation(A, idOri, idMA) {
    document.getElementById(idOri).style.display = 'block';
    let mA = document.getElementById(idMA);
    let t = "<h2>Matriz original</h2>";
    mA.innerHTML = t + printTable1(A);
    createSubMatrixes(A, idMA, 0, idMA, "primary", "secondary", "success", "warning");
    setTimeout(() => { unHideMatrixes(); }, 3000);

}

//Algoritmo para obtener mediante fuerza bruta el producto de dos matrices
function bruteForce(A, B) {
    if (A[0].length == B.length) {
        let result = new Array();
        for (let i = 0; i < A.length; i++) {
            let cols = new Array();
            for (let j = 0; j < B[0].length; j++) {
                let r = 0;
                for (let k = 0; k < B.length; k++) {
                    let t = A[i][k] * B[k][j];
                    r += t;
                }
                cols.push(r);
            }
            result.push(cols);
        }
        return result;
    } else {
        return undefined;
    }
}

//Obtiene una submatriz de una matriz, dando primero la matriz completa, de qué columna a qué columna irá y de qué fila a qué fila irá
function getSubMatrix(matrix, beginCol, endCol, beginRow, endRow) {
    let mt = new Array();
    for (let i = beginRow; i < endRow; i++) {
        let cols = new Array();
        for (let j = beginCol; j < endCol; j++) {
            cols.push(matrix[i][j]);
        }
        mt.push(cols);
    }
    return mt;
}

//Obtiene el valor absoluto de un entero (No se usa de momento xd)
function abs(a) {
    if (a < 0) return a * (-1);
    else return a;
}

//Obtiene la resta de dos matrices
function subtractionMatrix(A, B) {
    let result = new Array();
    let n = A.length;
    for (let i = 0; i < n; i++) {
        let col = new Array();
        for (let j = 0; j < n; j++) {
            let r = (A[i][j] - B[i][j]);
            col.push(r);
        }
        result.push(col);
    }
    return result;
}

//Obtiene la suma de dos matrices
function additionMatrix(A, B) {
    let result = new Array();
    let n = A.length;
    for (let i = 0; i < n; i++) {
        let col = new Array();
        for (let j = 0; j < n; j++) {
            col.push(A[i][j] + B[i][j]);
        }
        result.push(col);
    }
    return result;
}

//Función para concatenar 2 arreglos
function concatArrays(a, b) {
    let nn = new Array();
    for (let i in a) nn.push(a[i]);
    for (let i in b) nn.push(b[i]);
    return nn;
}

//Función para juntar 4 sub matrices en 1 matriz general
function concatMatrix(a, b, c, d) {
    let matrix = new Array();
    let n = a.length;
    for (let i = 0; i < n; i++) {
        let x = concatArrays(a[i], b[i]);
        matrix.push(x);
    }
    for (let i = 0; i < n; i++) {
        let y = concatArrays(c[i], d[i]);
        matrix.push(y);
    }
    return matrix;
}

//Función para realizar el producto de matrices mediante strassen
function strassen(A, B) {
    if (A.length <= 2) return bruteForce(A, B);
    let a, b, c, d, e, f, h, g,
        halfA = A.length / 2,
        halfB = B.length / 2;
    memoryUsedStPre += 2;
    memoryUsedStPre += ((A.length * A.length) + (B.length * B.length));
    a = getSubMatrix(A, 0, halfA, 0, halfA);
    b = getSubMatrix(A, halfA, A.length, 0, halfA);
    c = getSubMatrix(A, 0, halfA, halfA, A.length);
    d = getSubMatrix(A, halfA, A.length, halfA, A.length);
    e = getSubMatrix(B, 0, halfB, 0, halfB);
    f = getSubMatrix(B, halfB, B.length, 0, halfB);
    g = getSubMatrix(B, 0, halfB, halfB, B.length);
    h = getSubMatrix(B, halfB, B.length, halfB, B.length);
    memoryUsedStPre += ((a.length * a.length) + (b.length * b.length) + (c.length * c.length) + (d.length * d.length) + (e.length * e.length) + (f.length * f.length) + (g.length * g.length) + (h.length * h.length));
    let p1 = strassen(a, subtractionMatrix(f, h)),
        p2 = strassen(additionMatrix(a, b), h),
        p3 = strassen(additionMatrix(c, d), e),
        p4 = strassen(d, subtractionMatrix(g, e)),
        p5 = strassen(additionMatrix(a, d), additionMatrix(e, h)),
        p6 = strassen(subtractionMatrix(b, d), additionMatrix(g, h)),
        p7 = strassen(subtractionMatrix(a, c), additionMatrix(e, f)),
        f1 = additionMatrix(p5, p4),
        f2 = subtractionMatrix(f1, p2),
        c11 = additionMatrix(f2, p6),
        c12 = additionMatrix(p1, p2),
        c21 = additionMatrix(p3, p4);
    memoryUsedStPre += (Math.pow(p1.length, 2) + Math.pow(p2.length, 2) + Math.pow(p3.length, 2) + Math.pow(p4.length, 2) + Math.pow(p5.length, 2) + Math.pow(p6.length, 2) + Math.pow(p7.length, 2));
    memoryUsedStPre += (Math.pow(f1.length, 2) + Math.pow(f2.length, 2) + Math.pow(c11.length, 2) + Math.pow(c12.length, 2) + Math.pow(c21.length, 2))
    f1 = additionMatrix(p1, p5);
    f2 = subtractionMatrix(f1, p3);
    let c22 = subtractionMatrix(f2, p7);
    let result = concatMatrix(c11, c12, c21, c22);
    memoryUsedStPre += (Math.pow(f1.length, 2) + Math.pow(f2.length, 2) + Math.pow(c22.length, 2) + Math.pow(result.length, 2));
    return result;
}

//Función para poder mostrar un subconjunto de tablas para Strassen (Hecho para ahorrar tiempo)
function printHTMLTable(elementList, table) {
    for (let i in elementList) {
        elementList[i].innerHTML = table;
    }
}

//Función que realiza la animación de strassen
function strassenAnimation(A, idOri, idMA, B, idMB) {
    matrixSegmentationAnimation(A, idOri, idMA);
    matrixSegmentationAnimation(B, idOri, idMB);
    let halfA = A.length / 2,
        halfB = B.length / 2,
        a = getSubMatrix(A, 0, halfA, 0, halfA),
        b = getSubMatrix(A, halfA, A.length, 0, halfA),
        c = getSubMatrix(A, 0, halfA, halfA, A.length),
        d = getSubMatrix(A, halfA, A.length, halfA, A.length),
        e = getSubMatrix(B, 0, halfB, 0, halfB),
        f = getSubMatrix(B, halfB, B.length, 0, halfB),
        g = getSubMatrix(B, 0, halfB, halfB, B.length),
        h = getSubMatrix(B, halfB, B.length, halfB, B.length),
        p1 = bruteForce(a, subtractionMatrix(f, h)),
        p2 = bruteForce(h, additionMatrix(a, b)),
        p3 = bruteForce(e, additionMatrix(c, d)),
        p4 = bruteForce(d, subtractionMatrix(g, e)),
        p5 = bruteForce(additionMatrix(a, d), additionMatrix(e, h)),
        p6 = bruteForce(subtractionMatrix(b, d), additionMatrix(g, h)),
        p7 = bruteForce(subtractionMatrix(a, c), additionMatrix(e, f)),
        m11 = document.getElementById('m11'),
        m12 = document.getElementById('m12'),
        m21 = document.getElementById('m21'),
        m22 = document.getElementById('m22'),
        tagA = document.getElementsByName('A'),
        tagB = document.getElementsByName('B'),
        tagC = document.getElementsByName('C'),
        tagD = document.getElementsByName('D'),
        tagE = document.getElementsByName('E'),
        tagF = document.getElementsByName('F'),
        tagG = document.getElementsByName('G'),
        tagH = document.getElementsByName('H'),
        rfh = document.getElementsByName('rfh'),
        rp1 = document.getElementsByName('rp1'),
        sab = document.getElementsByName('sab'),
        rp2 = document.getElementsByName('rp2'),
        scd = document.getElementsByName('scd'),
        rp3 = document.getElementsByName('rp3'),
        rge = document.getElementsByName('rge'),
        rp4 = document.getElementsByName('rp4'),
        sad = document.getElementsByName('sad'),
        seh = document.getElementsByName('seh'),
        rp5 = document.getElementsByName('rp5'),
        rbd = document.getElementsByName('rbd'),
        sgh = document.getElementsByName('sgh'),
        rp6 = document.getElementsByName('rp6'),
        rac = document.getElementsByName('rac'),
        sef = document.getElementsByName('sef'),
        rp7 = document.getElementsByName('rp7');
    printHTMLTable(tagA, printTable(a));
    printHTMLTable(tagB, printTable(b));
    printHTMLTable(tagC, printTable(c));
    printHTMLTable(tagD, printTable(d));
    printHTMLTable(tagE, printTable(e));
    printHTMLTable(tagF, printTable(f));
    printHTMLTable(tagG, printTable(g));
    printHTMLTable(tagH, printTable(h));
    printHTMLTable(rfh, printTable(subtractionMatrix(f, h)));
    printHTMLTable(rp1, printTable(p1));
    printHTMLTable(sab, printTable(additionMatrix(a, b)));
    printHTMLTable(rp2, printTable(p2));
    printHTMLTable(scd, printTable(additionMatrix(c, d)));
    printHTMLTable(rp3, printTable(p3));
    printHTMLTable(rge, printTable(subtractionMatrix(g, e)));
    printHTMLTable(rp4, printTable(p4));
    printHTMLTable(sad, printTable(additionMatrix(a, d)));
    printHTMLTable(seh, printTable(additionMatrix(e, h)));
    printHTMLTable(rp5, printTable(p5));
    printHTMLTable(rbd, printTable(subtractionMatrix(b, d)));
    printHTMLTable(sgh, printTable(additionMatrix(g, h)));
    printHTMLTable(rp6, printTable(p6));
    printHTMLTable(rac, printTable(subtractionMatrix(a, c)));
    printHTMLTable(sef, printTable(additionMatrix(e, f)));
    printHTMLTable(rp7, printTable(p7));
    m11.innerHTML = printTable(getSubMatrix(tableResult, 0, tableResult.length / 2, 0, tableResult.length / 2));
    m12.innerHTML = printTable(getSubMatrix(tableResult, tableResult.length / 2, tableResult.length, 0, tableResult.length / 2));
    m21.innerHTML = printTable(getSubMatrix(tableResult, 0, tableResult.length / 2, tableResult.length / 2, tableResult.length));
    m22.innerHTML = printTable(getSubMatrix(tableResult, tableResult.length / 2, tableResult.length, tableResult.length / 2, tableResult.length));
    let r = document.getElementById('results');
    r.innerHTML = printTable(tableResult);
}

function verifyActive(array) {
    for (let i in array) {
        if (array[i] == 'Active' || array[i] == "active") return true;
    }
    return false;
}

function animatePart(id) {
    switch (id) {
        case 'paso1':
            console.log("holi");
            setTimeout(() => { unfade(document.getElementById('codp1')) }, 2000);
            break;
        case 'paso4':
            setTimeout(() => { unfade(document.getElementById('codp4')) }, 2000);
            break;
        case 'paso2p1':
            setTimeout(() => { unfade(document.getElementById('codp2p1')) }, 2000);
            break;
        case 'paso2p2':
            setTimeout(() => { unfade(document.getElementById('codp2p2')) }, 2000);
            break;
        case 'paso2p3':
            setTimeout(() => { unfade(document.getElementById('codp2p3')) }, 2000);
            break;
        case 'paso2p4':
            setTimeout(() => { unfade(document.getElementById('codp2p4')) }, 2000);
            break;
        case 'paso2p5':
            setTimeout(() => { unfade(document.getElementById('codp2p5')) }, 2000);
            break;
        case 'paso2p6':
            setTimeout(() => { unfade(document.getElementById('codp2p6')) }, 2000);
            break;
        case 'paso2p7':
            setTimeout(() => { unfade(document.getElementById('codp2p7')) }, 2000);
            break;
        case 'paso3p1':
            setTimeout(() => { unfade(document.getElementById('codp3p1')) }, 2000);
            break;
        case 'paso3p2':
            setTimeout(() => { unfade(document.getElementById('codp3p2')) }, 2000);
            break;
        default:
            break;
    }
}

function getActiveElementBack() {
    let elements = document.getElementsByName('carouselItem');
    for (let i = 0; i < elements.length; i++) {
        let clases = elements[i].className;
        clases = clases.split(" ");
        if (verifyActive(clases)) {
            if (elements[i] != undefined) {
                fade(document.getElementById(elements[i].id));
                if (i - 1 >= 0) setTimeout(() => { unfade(document.getElementById(elements[i - 1].id)); }, 2000);
                else setTimeout(() => { unfade(document.getElementById(elements[elements.length - 1].id)); }, 2000);
            }
        }
    }
}

function clearStrassenAnimation(elementFather) {
    if (elementFather != undefined) {
        let childs = elementFather.childNodes;
        for (let i = childs.length - 1; i >= 0; i--) {
            clearStrassenAnimation(childs[i]);
            childs[i].remove();
        }
    }
}

function getActiveElementFront() {
    let elements = document.getElementsByName('carouselItem');
    for (let i = 0; i < elements.length; i++) {
        let clases = elements[i].className;
        clases = clases.split(" ");
        if (verifyActive(clases)) {
            if (elements[i] != undefined) {
                fade(document.getElementById(elements[i].id));
                if (i + 1 < elements.length) {
                    setTimeout(() => {
                        unfade(document.getElementById(elements[i + 1].id));
                    }, 2000);
                    animatePart(elements[i + 1].id);
                } else {
                    setTimeout(() => { unfade(document.getElementById(elements[0].id)); }, 2000);
                    animatePart(elements[0].id);
                    clearStrassenAnimation(document.getElementById('matrixSegmented'));
                    clearStrassenAnimation(document.getElementById('matrixSegmented2'));
                    strassenAnimation(tableValues, 'strassenAnimation', 'matrixSegmented', tableValues2, 'matrixSegmented2');
                }
            }
        }
    }
}

//Genera un color aleatorio para la animación de las tablas
function getColor(color) {
    if (color > 4) color -= 5;
    switch (color) {
        case 0:
            return "primary";
        case 1:
            return "secondary";
        case 2:
            return "success";
        case 3:
            return "warning";
        case 4:
            return "danger";
    }
}

//Prepara la tabla A para la animación
function printTableA(A) {
    let n = A.length;
    let m = A[0].length;
    let table = "<div class='table-responsive'><table class='table'><tbody>";
    for (let i = 0, id = 0; i < n; i++, id++) {
        table += "<tr id='row_" + id + "'>";
        for (let j = 0; j < m; j++) {

            table += "<td>" + A[i][j] + "</td>";
        }
        table += "</tr>";
    }
    table += "</tbody></table></div></div>";
    return table;
}

//Prepara la tabla B para la animación
function printTableB(A) {
    let n = A.length;
    let m = A[0].length;
    let table = "<div class='table-responsive'><table class='table'><tbody>";
    for (let i = 0; i < n; i++) {
        table += "<tr>";
        for (let j = 0; j < m; j++) {
            table += "<td name='col_" + j + "'>" + A[i][j] + "</td>";
        }
        table += "</tr>";
    }
    table += "</tbody></table></div></div>";
    return table;
}

//Prepara la tabla resultante en formato html para la animación
function printTableR(A) {
    let n = A.length;
    let m = A[0].length;
    let table = "<div class='table-responsive'><table class='table'><tbody>";
    for (let i = 0, id = 0; i < n; i++) {
        table += "<tr>";
        for (let j = 0; j < m; j++, id++) {
            table += "<td id='cell_" + id + "'>" + A[i][j] + "</td>";
        }
        table += "</tr>";
    }
    table += "</tbody></table></div></div>";
    return table;
}

//Cambia el color del texto de la tabla resultante con el fin de simular que no existen los valores
function hideCells(R) {
    for (let i = 0, x = 0; i < R.length; i++) {
        for (let j = 0; j < R[0].length; j++, x++) {
            let id = "cell_" + x;
            document.getElementById(id).setAttribute('class', 'whiteText');
        }
    }
}

//Realiza el barrido que se muestra en la animación, mostrando un color para X fila, Y columna y Z celda
function showCells(A, B) {
    for (let i = 0, x = 0, time = 1000; i < A.length; i++) {
        let idrow = "row_" + i,
            row = document.getElementById(idrow),
            color = "table-" + getColor(i);
        for (let j = 0; j < B[0].length; j++, x++, time += 1000) {
            let idcols = "col_" + j,
                col = document.getElementsByName(idcols),
                idcell = "cell_" + x,
                cell = document.getElementById(idcell);
            setTimeout(() => { row.setAttribute('class', color); }, time);
            for (let k = 0; k < B.length; k++) {
                setTimeout(() => { col[k].setAttribute('class', color); }, time);
            }
            setTimeout(() => { cell.setAttribute('class', color); }, time);
        }
    }
}

//Función principal para invocar la animación por strassen o la de fuerza bruta
function stAnima() {
    fade(document.getElementById('lockedTables'));
    if (strs && tableValues.length <= 16) {
        strassenAnimation(tableValues, 'strassenAnimation', 'matrixSegmented', tableValues2, 'matrixSegmented2');
        showComplexity();
    } else if (strs) {
        alert("Para poder ver una animación del procedimiento, se recomienda usar matrices de 8x8 o 4x4");
        showComplexity();
    } else {
        if (tableValues.length > 12) {
            alert("Para poder ver una animación del procedimiento se recomienda usar matrices menores a 12x12");
            document.getElementById('bruteforceAnimation').style.display = 'block';
            document.getElementById('btProce').style.display = 'none';
            showComplexity();
        } else {
            bfAnima();
            showComplexity();
        }

    }
}

//Función de activación para la animación de fuerza bruta
function bfAnima() {
    document.getElementById('bruteforceAnimation').style.display = 'block';
}

//Precarga las tablas para la animación
function loadTablesBfAnima() {
    bruteAnimation(tableValues, tableValues2, tableResult);
}
//Bloquea las tablas ingresadas y muestra el resultado del producto de las matrices dadas anteriormente
function lockTables() {
    setTimeout(() => { unfade(document.getElementById("lockedTables")); }, 3000);
    let a = document.getElementById('table3'),
        b = document.getElementById('table4'),
        c = document.getElementById('table5'),
        title = "Resultado del producto de dos matrices",
        matrixAType = verifyTypeMatrix(tableValues),
        matrixBType = verifyTypeMatrix(tableValues2),
        result = new Array();
    if (matrixAType == "p2" && matrixBType == "p2" && tableSizeX1 == tableSizeY1 && tableSizeX2 == tableSizeY2) {
        let beginTime = new Date().getTime();
        result = strassen(tableValues, tableValues2);
        let endTime = new Date().getTime();
        tableResult = result;
        timeStrassen = endTime - beginTime;
        strs = true;
        let beginTime2 = new Date().getTime();
        result = bruteForce(tableValues, tableValues2);
        let endTime2 = new Date().getTime();
        tableResult = result;
        timeBrute = endTime2 - beginTime2;
    } else {
        if (tableValues[0].length == tableValues2.length) {
            let beginTime2 = new Date().getTime();
            result = bruteForce(tableValues, tableValues2);
            let endTime2 = new Date().getTime();
            tableResult = result;
            timeBrute = endTime2 - beginTime2;
        } else
            alert("No se puede realizar el producto, prueba con otra combinación ya que para que se pueda hacer se ocupa que las filas de la Matriz B sea igual que al de columnas de la Matriz A");
    }
    if (tableValues.length <= 256) {
        if (strs) title += " usando Strassen";
        else title += " usando Fuerza bruta";
        let tit = document.getElementById("titleProduct");
        fade(document.getElementById("inputTables"));
        tit.innerHTML = title;
        setTimeout(() => { unfade(a); }, 5000);
        a.innerHTML = printTable(tableValues);
        setTimeout(() => { unfade(b); }, 6000);
        b.innerHTML = printTable(tableValues2);
        setTimeout(() => { unfade(c); }, 7000);
        c.innerHTML = printTable(result);

    }
    document.getElementById('btnProce').style.display = "block";
}

//Función para generar un arreglo para las gráficas con base a la cantidad de operaciones
function getArray(data) {
    let x = new Array();
    let ll = 10;
    let n = data / ll;
    for (let i = 1; i <= ll; i++) {
        x.push(Math.floor((i * n)));
    }
    return x;
}

//Función que precalcula de manera simple cuánta memoria se usó a lo largo de la ejecución contando únicamente con variables enteras con representación en 8 bits
function preCalculateMemory(noVars) {
    let memory = noVars * 8;
    if (memory >= 1024 && memory <= 1048576) return (memory / 1024).toFixed(2) + " KiloBytes";
    else if (memory > 1048576 && memory <= 1099511627776) return (memory / 1048576).toFixed(2) + " MegaBytes";
    else if (memory > 1099511627776) return (memory / 1099511627776).toFixed(2) + " GigaBytes";
    else return memory + " Bytes";
}

//Función para mostrar la complejidad y tablas que se muestran para ejemplificar cuántas operaciones hace y demás
function showComplexity() {
    document.getElementById('tablesAnima2').style.display = "block";
    document.getElementById('lockedTables').style.display = "none";
    let c2 = document.getElementById('complexitySTS'),
        c4 = document.getElementById('complexityDACT'),
        f = document.getElementById('timeResult2'),
        g = document.getElementById('timeResult3'),
        h = document.getElementById('memoryBrute'),
        k = document.getElementById('memorySts'),
        c21 = document.getElementById('complexitySTS1'),
        c41 = document.getElementById('complexityDACT1'),
        f1 = document.getElementById('timeResult21'),
        g1 = document.getElementById('timeResult31'),
        h1 = document.getElementById('memoryBrute1'),
        k1 = document.getElementById('memorySts1'),
        cDAC = Math.pow((tableSizeX1 * tableSizeY1) + (tableSizeX2 * tableSizeY2), 3),
        cSTS = Math.floor(Math.pow(Math.pow(tableSizeX1, 2), 2.81));
    if (strs && tableValues.length <= 16) {
        c2.innerHTML = cSTS;
        c4.innerHTML = cDAC;
        document.getElementById('stsGraphs').style.display = "block";
        if (timeStrassen > 1000) f.innerHTML = (timeStrassen / 1000 + " s");
        else f.innerHTML = (timeStrassen + " ms");
        let memoryUsedBrute = preCalculateMemory((4 + (tableSizeX1 * tableSizeY1) + (tableSizeX2 * tableSizeY2) + (tableSizeX1 * tableSizeY2)));
        if (timeBrute > 1000) g.innerHTML = (timeBrute / 1000 + " s");
        else g.innerHTML = (timeBrute + " ms");
        h.innerHTML = memoryUsedBrute;
        let memoryUsedSts = preCalculateMemory(memoryUsedStPre + 16 + Math.pow(tableResult.length, 2));
        k.innerHTML = (memoryUsedSts);
        drawGraph1(getArray(cSTS));
        document.getElementById('bfGraph').style.display = "none";
    } else if (strs) {
        document.getElementById('bruteforceAnimation').style.display = 'block';
        document.getElementById('btProce').style.display = 'none';
        document.getElementById('tablesAnima2').style.display = 'block';
        c21.innerHTML = cSTS;
        c41.innerHTML = cDAC;
        document.getElementById('stsGraphs').style.display = "block";
        if (timeStrassen > 1000) f1.innerHTML = (timeStrassen / 1000 + " s");
        else f1.innerHTML = (timeStrassen + " ms");
        let memoryUsedBrute = preCalculateMemory((4 + (tableSizeX1 * tableSizeY1) + (tableSizeX2 * tableSizeY2) + (tableSizeX1 * tableSizeY2)));
        if (timeBrute > 1000) g1.innerHTML = (timeBrute / 1000 + " s");
        else g1.innerHTML = (timeBrute + " ms");
        h1.innerHTML = memoryUsedBrute;
        let memoryUsedSts = preCalculateMemory(memoryUsedStPre + 16 + Math.pow(tableResult.length, 2));
        k1.innerHTML = (memoryUsedSts);
        document.getElementById('h2Anima').innerHTML = "Gr&aacute;fica de tiempo de resoluci&oacute;n usando Strassen";
        drawGraph(getArray(cSTS));
        document.getElementById('bfGraph').style.display = "block";
    } else {
        document.getElementById('bfGraph').style.display = "block";
        c21.innerHTML = "No se puede usar Strassen por este m&eacute;todo.";
        k1.innerHTML = g1.innerHTML = "No aplica";
        let memoryUsedBrute = preCalculateMemory((4 + (tableSizeX1 * tableSizeY1) + (tableSizeX2 * tableSizeY2) + (tableSizeX1 * tableSizeY2)));
        h1.innerHTML = (memoryUsedBrute);
        if (timeBrute > 1000) f1.innerHTML = (timeBrute / 1000 + " s");
        else f1.innerHTML = (timeBrute + " ms");
        drawGraph(getArray(cDAC));
        document.getElementById('stsGraphs').style.display = "none";
        c41.innerHTML = cDAC;
    }
}

//Función para invocar la animación por fuerza
function bruteAnimation(A, B, R) {
    fade(document.getElementById('btnBFAnima'));
    let div = document.getElementById('bruteforceAnimation'),
        mA = document.getElementById('MA'),
        mB = document.getElementById('MB'),
        mR = document.getElementById('MR');
    unfade(div);
    unfade(document.getElementById('tablesAnima'));
    mA.innerHTML = printTableA(A);
    mB.innerHTML = printTableB(B);
    mR.innerHTML = printTableR(R);
    hideCells(R);
    showCells(A, B);
}

//Función usada para retroceder un paso en la demostración
function backStep(pasoAct, pasoAnt) {
    fade(document.getElementById(pasoAct));
    setTimeout(() => { unfade(document.getElementById(pasoAnt)); }, 1000);
}

//Función usada para avanzar un paso en la demostración
function nextStep(pasoSig, pasoAct) {
    if (pasoSig == 'complex') showComplexity();
    else {
        fade(document.getElementById(pasoAct));
        setTimeout(() => { unfade(document.getElementById(pasoSig)); }, 1000);
    }
    let t = document.getElementsByName(pasoSig);
    let t1 = document.getElementsByName(pasoAct);
    if (t != null && t != undefined && t.length > 0) t[0].style.display = 'block';
    if (t1 != null && t1 != undefined && t1.length > 0) t1[0].style.display = 'none';

}

//Muestra la información ya sea de strassen o fuerza bruta
function info(infos) {
    let x, y;
    if (infos) {
        x = document.getElementById('trad');
        y = document.getElementById('stras');
    } else {
        x = document.getElementById('stras');
        y = document.getElementById('trad');
    }
    fade(y);
    unfade(x);
}
let pos = 0;

function nextSlide() {
    let id = "poster" + pos + 1;
    let x = document.getElementById(id);
    x.setAttribute('class', 'active');

}