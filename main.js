$(document).ready(function () {


    //VARIABLES
    var InitialRange, FinalRange, slope;



    //END VARIABLES




    //copypaste//

    //Comercial resistor values up to 1k
    var listado = [1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5100, 5600, 6800, 8200, 10000];
    var listado1 = [1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5100, 5600, 6800, 8200, 10000];
    var listado2 = [1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5100, 5600, 6800, 8200, 10000];
    var nactual = 1;
    var tipo = ["Amplificador Inversor", "Amplificador no Inversor"];

    $('#tipo').val(tipo[nactual - 1]);

    function Shot() {
        const tipoText = $('#tipo').val();
        console.log(tipoText);
        if (tipoText == "Amplificador Inversor") {
            ShotInversor();
        } else if (tipoText == "Amplificador no Inversor") {
            ShotNOInversor();
        }
    }

    function ShotInversor() {
        var user1 = parseFloat(document.getElementById('GainUser').value);
        var user2 = parseFloat($('#porcentaje').val());

        AInversor(user1, user2);
    }

    function ShotNOInversor() {
        var user1 = parseFloat(document.getElementById('GainUser').value);
        var user2 = parseFloat($('#porcentaje').val());


        noInverter(user1, user2);
    }

    function selectAll() {
        this.select();
    }
    $('#jeje').click(Shot);
    $('#next').click(next);
    $('#before').click(before);

    function next() {
        nactual++;
        if (nactual > 2) {
            nactual = 1;
        }
        $('#imagen').attr("src", "img/" + nactual + ".png");


        $('#tipo').val(tipo[nactual - 1]);





    }

    function before() {
        nactual--;
        if (nactual < 1) {
            nactual = 2;
        }
        $('#imagen').attr("src", "img/" + nactual + ".png");
        $('#tipo').val(tipo[nactual - 1]);



    }




    /*Range() Function:Recieve a resistor, adjust the array with comercial resistor values to 
    its range
    */
    function toRange(resistor, comerciallist) {

        if (resistor > 1000000) {

            for (let i in comerciallist) {
                comerciallist[i] = comerciallist[i] * 1000;
            }
        } else if (resistor > 100000) {

            for (let i in comerciallist) {
                comerciallist[i] = comerciallist[i] * 100;
            }
        } else if (resistor > 10000) {

            for (let i in comerciallist) {
                comerciallist[i] = comerciallist[i] * 10;
            }
        }
    }

    /*Reset function: It receives an arralist with comercial values as input. Function turn
    it back to it orginal state (starting with1k resistor)*/
    function Reset(pListado) {
        if (pListado[0] >= 1000000) {
            for (let i in pListado) {
                pListado[i] = pListado[i] / 1000;
            }
        } else if (pListado[0] >= 100000) {

            for (let i in pListado) {
                pListado[i] = pListado[i] / 100;
            }
        } else if (pListado[0] >= 10000) {

            for (let i in pListado) {
                pListado[i] = pListado[i] / 10;
            }
        }
    }
    /*getResistor function generates a random resistor between range give in parameter. Does not includes
    first value, if you want to, substract an unit from it.*/
    function getResistor(pMax, pMin) {
        var resistor = Math.floor(Math.random() * (pMax - pMin)) + pMin; // Generate random resistor betwen comercial range.
        return resistor;
    }
    /*getComercial: Returns the neerest comercial resistor of the vector provided*/
    function getComercial(resistor, vector) {
        var comercialResistor = resistor;
        var menorfinal = 800;
        var menoractual;
        var indice = 897;
        for (var i in vector) {
            menoractual = Math.abs(comercialResistor - vector[i]);
            if (menoractual < menorfinal) {
                menorfinal = menoractual;
                indice = i;
            }
        }
        comercialResistor = vector[indice];

        return comercialResistor;
    }
    /*GetComercialRandomResistor function generates a random resistor, adjust vector to its value and generates
    a valid comercial resistor. Params: Min max Range, list to adjust, resistor*/
    function GetComercialRandomResistor(min, max, pListado, pResistor) {
        Reset(pListado);
        if (pResistor == null) {
            var resistor = getResistor(min, max);
        } else {
            var resistor = pResistor;
        }
        toRange(resistor, pListado);
        resistor = getComercial(resistor, pListado);
        return resistor;
    }
    /*ToWhatsappmethod URL ENCODE String to generate a whatsapp link*/
    function ToWhatsapp(text, whatsappphonenumber) {
        return "https://wa.me" + whatsappphonenumber + "/?text=" + encodeURIComponent(text);
    }
    /*AInversor function: Receives gain an suggested resistor. It returns
    a pair of resistor that follow the ecuation, this is theoricall value.
    Uses random function for getting one comercial resistor if required*/
    function AInversor(pGain, pTolerance) {
        var initialResistor;
        var practialGain;
        var tolerancia = (pGain * pTolerance) / 100;
        var up = pGain + tolerancia;
        var down = pGain - tolerancia;
        var actual = 0

        r2 = GetComercialRandomResistor(1000, 10000000, listado); // Generates Comercial random resistor
        r1 = r2 / pGain; //Calculate R1 from ecuation
        r1 = GetComercialRandomResistor(1000, 10000000, listado1, r1); // Generates Comercial random resistor

        practialGain = r2 / r1; //Checking

        if (practialGain > down && practialGain < up) {

            console.log("Un ciclo R2: " + r2 + " R1:" + r1 + " Gain:" + practialGain);


        }
        while (!(practialGain > down && practialGain < up)) {

            r2 = GetComercialRandomResistor(1000, 10000000, listado); // Generates Comercial random resistor
            r1 = r2 / pGain;
            r1 = GetComercialRandomResistor(1000, 10000000, listado1, r1);
            practialGain = r2 / r1;

        }
        $('#values').text("R1: " + r1 + " R2: " + r2 + " Ganancia: " + practialGain);

        //return [r1,r2,practialGain];
        var saludo = "Hola! Gracias por utilizar el servicio, los valores obtenidos son: Primer Operacional ->"
        var texto = "R1: " + r1 + " R2: " + r2 + " Ganancia: " + practialGain;
        console.log(texto);
        $('#values').text(texto); //Print on website
        texto = saludo + texto;

        $("#whatsapp").attr("href", ToWhatsapp(texto, "")); //Generate whatsapp url
        var codeR1 = r1.toString();
        var codeR2 = r2.toString();
        ColorsCode(codeR1, false);
        ColorsCode(codeR2, true);

    }

    function noInverter(pGain, pTolerance) {
        var practialGain;
        var tolerancia = (pGain * pTolerance) / 100;
        var up = pGain + tolerancia;
        var down = pGain - tolerancia;
        var actual = 0;
        /*ECUATION FOR THIS AMPLIFIER GAIN=1+R2/R1*/
        r2 = GetComercialRandomResistor(1000, 1000000, listado); // Get comercial RANDOM value for R2
        r1 = r2 / (pGain - 1); //Teorical value for R1.
        r1 = GetComercialRandomResistor(1000, 1000000, listado1, r1); // Get comercial value for R1
        practialGain = 1 + (r2 / r1); // Get practical gain
        if (practialGain > down && practialGain < up) {
            console.log("Un ciclo R2: " + r2 + " R1:" + r1 + " Gain:" + practialGain);
        }
        while (!(practialGain > down && practialGain < up)) {
            r2 = GetComercialRandomResistor(1000, 1000000, listado);
            r1 = r2 / (pGain - 1); //Teorical value for R1.
            r1 = GetComercialRandomResistor(1000, 1000000, listado1, r1); // Get comercial value for r1
            practialGain = 1 + (r2 / r1); // Get practical gain
        }
        var saludo = "Hola! Gracias por utilizar el servicio, los valores obtenidos son: "
        var texto = "R1: " + r1 + " R2: " + r2 + " Ganancia: " + practialGain;
        $('#values').text("R1: " + r1 + " R2: " + r2 + " Ganancia: " + practialGain);

        //return [r1,r2,practialGain];
        var saludo = "Hola! Gracias por utilizar el servicio, los valores obtenidos son: "
        var texto = "R1: " + r1 + " R2: " + r2 + " Ganancia: " + practialGain;

        $('#values').text(texto);
        texto = saludo + texto;

        $("#whatsapp").attr("href", ToWhatsapp(texto, ""));
        var codeR1 = r1.toString();
        var codeR2 = r2.toString();
        ColorsCode(codeR1, false);
        ColorsCode(codeR2, true);

    }

    function Adder(pSignal1, pSignal2, pOutup) {
        if (pSignal2 > 1 && pSignal2 <= 5) {
            Signal2 = 5;
        } else if (pSignal2 > 5) {
            Signal2 = 15;
        } else {
            Signal2 = 0.7;
        }
        var localGain = pOutup / Signal2;
        AInversor(localGain, 5);
        r3 = r2;
        console.log("Hola" + r1 + " " + r2 + " " + r3 + "Señal " + Signal2);



    }

    function ColorsCode(pResistor, r1orr2) {
        var code = {
            0: "black",
            1: "Maroon",
            2: "#e72424",
            3: "#e76624",
            4: "yellow",
            5: "green",
            6: "#24d7e7",
            7: "purple",
            8: "grey",
            9: "white"
        }
        var contador = 1;
        for (var je of pResistor) {
            console.log(je);
            var change = code[je];
            console.log(change);

            console.log("Contador:" + contador);
            var frase = "Colors";

            if (r1orr2 == true) {
                console.log("ENTRE");
                frase = frase.toLowerCase();

            }
            var textoAux = "#" + frase + contador;
            console.log(textoAux);
            $(textoAux).css("background-color", change);
            contador++;
            if (contador > 2) {
                break;
            }

        }
        contador = 3;
        textoAux = "#" + frase + contador;
        if (pResistor >= 1000000) {
            $(textoAux).css("background-color", code[5]);

        } else if (pResistor >= 100000) {
            $(textoAux).css("background-color", code[4]);

        } else if (pResistor >= 10000) {
            $(textoAux).css("background-color", code[3]);

        } else if (pResistor >= 1000) {
            $(textoAux).css("background-color", code[2]);

        } else {
            $(textoAux).css("background-color", code[1]);

        }



    }




    function ColorsCode2(pResistor, pId) {
        pResistor = pResistor.toString(); //Conver to String allow iterarions

        var code = {
            0: "black",
            1: "Maroon",
            2: "#e72424",
            3: "#e76624",
            4: "yellow",
            5: "green",
            6: "#24d7e7",
            7: "purple",
            8: "grey",
            9: "white"
        }
        var contador = 1;
        for (var je of pResistor) {
            console.log(je);
            var change = code[je];
            console.log(change);

            console.log("Contador:" + contador);
            var frase = pId;

            var textoAux = "#" + frase + contador;
            console.log(textoAux);
            $(textoAux).css("background-color", change);
            contador++;
            if (contador > 2) {
                break;
            }

        }
        contador = 3;
        textoAux = "#" + frase + contador;
        if (pResistor >= 1000000) {
            $(textoAux).css("background-color", code[5]);

        } else if (pResistor >= 100000) {
            $(textoAux).css("background-color", code[4]);

        } else if (pResistor >= 10000) {
            $(textoAux).css("background-color", code[3]);

        } else if (pResistor >= 1000) {
            $(textoAux).css("background-color", code[2]);

        } else {
            $(textoAux).css("background-color", code[1]);

        }



    }

    //end copypaste//



    if (localStorage.UserName != null) {
        $('.seleccion').fadeIn(1000);
        $('.opcion1').fadeIn(1000);
        $('.opcion2').fadeIn(1000);
        $('.opcion3').fadeIn(1000);

        console.log("ENTRE");
    } else {
        $('.centrame').fadeIn(1000);

    }

    //ANIMATION
    function Tutorial() {

        $('.fondo .centrame').delay(2000).fadeOut(1000).queue(function () {
            responsiveVoice.speak(" Hola Sere tu asistente. juntos vamos a construir algo genial para ti.", "Spanish Latin American Female");
            $(this).dequeue();

        });
        $('.fondo .eva').delay(6000).fadeIn(3000).queue(function () {
            responsiveVoice.speak("Mi nombre es Eva, Bienvenido", "Spanish Latin American Female");
            $(this).dequeue();

        });
        $('.fondo .eva').delay(2600).queue(function () {
            responsiveVoice.speak("Estoy programada para ayudarte a diseñar circuitos acondicionadores", "Spanish Latin American Female");
            $(this).dequeue();

        });
        $('.fondo .eva').fadeOut(1000).queue(function () {
            $('.fondo .uno').fadeIn(1000).delay(1000).fadeOut(1000);
            $('.nombre').delay(3000).fadeIn(1000);
            $(this).dequeue();
        });
    }

    function actualizarNombre() {
        var UserName = $('#nombreForm').val();
        localStorage.UserName = UserName; //Saving Username for next sesion.
    }

    function Mostrar_opciones() {
        actualizarNombre();
        $('.nombre').fadeOut(1000);
        $('.seleccion').delay(500).fadeIn(1000);
        $('.opcion1').delay(1500).fadeIn(1000).delay(6000).fadeOut(500);
        $('.opcion2').delay(9000).fadeIn(1000).delay(4000).fadeOut(500);
        $('.opcion3').delay(14500).fadeIn(1000).delay(5500).fadeOut(500).queue(function () {
            $('.opcion1').fadeIn(1000);
            $('.opcion2').fadeIn(1000);
            $(this).fadeIn(1000);
            $(this).dequeue();



        });

        responsiveVoice.speak("Puedo hacer lo siguiente", "Spanish Latin American Female", {
            onend: second
        });

        function second() {
            responsiveVoice.speak("Convierte una señal pequeña o con valores negativos en una señal en el rango deseado...", "Spanish Latin American Female", {
                onend: third
            });

        }

        function third() {
            responsiveVoice.speak("Convierte la salida de un sensor en una señal que representa la variable fisica medida...", "Spanish Latin American Female", {
                onend: fourth
            });

        }

        function fourth() {
            responsiveVoice.speak("Genera las resistencias comerciales necesarias para obtener un amplificador con la ganancia dada", "Spanish Latin American Female");

        }
    }

    function Mostrar_valores_1() {

        $('.seleccion').fadeOut(1000);
        $('#RangoInicial').delay(500).fadeIn(1000);


    }

    function Mostrar_valores_2() {
        rangoInicialUser = $('#rangoInicialUser').val();
        console.log(rangoInicialUser);
        $('#RangoInicial').fadeOut(1000);
        $('#RangoFinal').delay(500).fadeIn(1000);

    }

    function Shot0ToRange() {
        var constante;
        rangoFinalUser = $('#rangoFinalUser').val(); // GET VALUES FROM USER
        rangoFinalUser = SplitRange(rangoFinalUser); //SEPARATE COMAS
        rangoInicialUser = SplitRange(rangoInicialUser); //SEPARATE COMAS
        getEcuation(rangoInicialUser, rangoFinalUser); // GET ECUATION
        AInversor(slope, 5);

        $('#RangoFinal').fadeOut(1000);
        $('#Resultados').delay(1000).fadeIn(1000);
        $('#PrimerAOPR1').html("R1: " + r1);
        $('#PrimerAOPR2').html("R2: " + r2);
        ColorsCode2(r1, "ColorsAOP11");
        ColorsCode2(r2, "ColorsAOP12");
        var imagenUrl = "https://electronictools.000webhostapp.com/test/Mediano.png"
        var texto = "Hola! Gracias por utilizar el servicio. El plano esta disponible en " + imagenUrl + ". Primer Operacional -> R1:" + r1 + " R2: " + r2;
        if (b == 0) { // NO CONSTANT TO BE ADDES
            r1 = 1000;
            r2 = 1000;
            r3 = r2;
            constante = b; // ADD 0 V DC SOURCE
        } else {
            Adder("A", b, b); // NORMAL CASE, CALCUALTE RESISTOR FOR AMPLIFIER

        }
        $('#SegundoAOPR1').html("R3: " + r1);
        $('#SegundoAOPR2').html("R4: " + r2);
        $('#SegundoAOPR3').html("R5: " + r3);

        ColorsCode2(r1, "ColorsAOP21");
        ColorsCode2(r2, "ColorsAOP22");
        ColorsCode2(r3, "ColorsAOP23");

        if (b > 0) {
            //NEED YTO ADD NEGATIVE DC SOURCE
            constante = Signal2;
        } else if (b == 0) {

            constante = 0;
        } else {
            constante = -Signal2;
        }
        if (constante >= 0) {
            var polaridad = "negativa";
        } else {
            var polaridad = "positiva";
        }
        $('#constante').html("Fuente " + polaridad + " de " + constante + " voltios");
        $('#alimentacion').html("Mayor a: " + rangoFinalUser[1] + " pero menor <b>vccmax</b> del aop");

        texto = texto + ". El segundo operacional ->" + "R5: " + r1 + " R4: " + r2 + " R3: " + r3;
        texto = texto + "Se debe agregar una fuente constante de: " + constante + " *Observa la polaridad de la fuente!*";
        console.log(texto);
        var guardame = ToWhatsapp(texto, "");
        $('#guaza').click(function () {
            window.open(guardame);
        });



    }

    console.log("AHi voy");
    console.log(rangoInicialUser);
    console.log(rangoFinalUser);
    //END ANIMATION

    // EVENTOS INICIAL


    $('#dame').click(Tutorial);
    $('#nameForm').click(Mostrar_opciones);
    $('#rango_senal').click(Mostrar_valores_1);
    /* ADD SELECTION WHEN CLICK FIELDS */
    $('#rangoInicialUser').click(function(){
        $(this).select();

    });
    $('#rangoFinalUser').click(function(){
        $(this).select();

    });
    /* FINISH SELECTION */
    /*START FORM VALIDATION*/
    $('#rangoInicialButton').click(function () {
        rangoInicialUser = $('#rangoInicialUser').val(); //CHECK IF NULL

        if (rangoInicialUser == null || rangoInicialUser == "" || !(rangoInicialUser.includes(','))) {

            document.getElementById("rangoInicialUser").value = "Ingresa un valor valido";
        } else {
            Mostrar_valores_2();

        }
    });
    $('#rangoFinalButton').click(function () {
        rangoFinalUser = $('#rangoFinalUser').val(); //CHECK IF NULL

        if (rangoFinalUser == null || rangoFinalUser == "" || !(rangoFinalUser.includes(','))) {

            document.getElementById("rangoFinalUser").value = "Ingresa un valor valido";
        } else {
            Shot0ToRange();

        }
    });
    /** end FORM VALIDATION TOOL */
    //FINAL EVENTOS


    //FUNCTIONES FOR SIGNAL ACONDICIONAMIENT
    // START 0 TO RANGE FUNCTIONS
    function SplitRange(StringToSplit) {
        StringToSplit = StringToSplit.split(",");
        console.log(StringToSplit);
        return StringToSplit;

    }

    function getEcuation(pInitialRange, pFinalRange) {
        slope = (pFinalRange[1] - pFinalRange[0]) / (pInitialRange[1] - pInitialRange[0]);
        console.log(slope);
        b = pFinalRange[0] - (slope * pInitialRange[0]); // Get constant
        var output = slope + "*x" + "+" + b; // Make Output Ecuation
        console.log(output);

        /*
        var uno = output.split("+"); // Split Slope
        console.log(uno);
        var dos = uno[0].split("*");
        dos = dos[0];
        console.log(dos);

        */

    }
    /* prueba 
    var UserInitialRange = "-2,2";
    var UserFinalRange = "0,5";
    UserFinalRange = SplitRange(UserFinalRange);
    UserInitialRange = SplitRange(UserInitialRange);
    */
    //getEcuation(UserInitialRange,UserFinalRange);
    //AInversor(slope,5);
    //Adder(5, 5, 2.5);

    // START 0 TO RANGE FUNCTIONS END


});
