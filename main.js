$(document).ready(function(){

	//Comercial resistor values up to 1k
	var listado = [1000,1200,1500,1800,2200,2700,3300,3900,4700,5100,5600,6800,8200,10000];
	var listado1 = [1000,1200,1500,1800,2200,2700,3300,3900,4700,5100,5600,6800,8200,10000];
	var listado2 = [1000,1200,1500,1800,2200,2700,3300,3900,4700,5100,5600,6800,8200,10000];
	var nactual=1;
	var tipo =["Amplificador Inversor","Amplificador no Inversor"];
	
	$('#tipo').val(tipo[nactual-1]);

	function Shot(){
	const tipoText = $('#tipo').val();
	console.log(tipoText);
	if(tipoText=="Amplificador Inversor"){
		ShotInversor();
	} else if(tipoText=="Amplificador no Inversor"){
		ShotNOInversor();
	}
	}
	function ShotInversor(){
		var user1 = parseFloat(document.getElementById('GainUser').value);
		var user2 = parseFloat($('#porcentaje').val());
		
		AInversor(user1,user2);
	}
	function ShotNOInversor(){
		var user1 = parseFloat(document.getElementById('GainUser').value);
		var user2 = parseFloat($('#porcentaje').val());
		
		
		noInverter(user1,user2);
	}
	function selectAll(){
		this.select();
	}
	$('#jeje').click(Shot);
	$('#next').click(next);
	$('#before').click(before);
	function next(){
		nactual++;
		if(nactual>2){
			nactual=1;
		}
		$('#imagen').attr("src","img/"+nactual+".png");
		
		
		$('#tipo').val(tipo[nactual-1]);
		




	}
	function before(){
		nactual--;
		if(nactual<1){
			nactual=2;
		}
		$('#imagen').attr("src","img/"+nactual+".png");
		$('#tipo').val(tipo[nactual-1]);



	}
	



/*Range() Function:Recieve a resistor, adjust the array with comercial resistor values to 
its range
*/
	function toRange(resistor,comerciallist){

		if(resistor>1000000){
			
			for(let i in comerciallist){
				comerciallist[i] = comerciallist[i]*1000;
			}
		}else if (resistor>100000){
			
			for(let i in comerciallist){
				comerciallist[i] = comerciallist[i]*100;
			}
		}else if (resistor>10000){
			
			for(let i in comerciallist){
				comerciallist[i] = comerciallist[i]*10;
			}
		} 
	}
	
/*Reset function: It receives an arralist with comercial values as input. Function turn
it back to it orginal state (starting with1k resistor)*/
	function Reset(pListado){
		if(pListado[0]>=1000000){
			for(let i in pListado){
				pListado[i]=pListado[i]/1000;
			}
		} else if(pListado[0]>=100000){

			for(let i in pListado){
				pListado[i]=pListado[i]/100;
			}
		} else if(pListado[0]>=10000){

			for(let i in pListado){
				pListado[i]=pListado[i]/10;
			}
		}
	}
/*getResistor function generates a random resistor between range give in parameter. Does not includes
first value, if you want to, substract an unit from it.*/
	function getResistor(pMax,pMin){
		var resistor = Math.floor(Math.random() * (pMax - pMin)) + pMin; // Generate random resistor betwen comercial range.
		return resistor;
	}
	/*getComercial: Returns the neerest comercial resistor of the vector provided*/
	function getComercial(resistor,vector){
		var comercialResistor = resistor;
		var menorfinal=800;
		var menoractual;
		var indice = 897;
		for (var i in vector){
			menoractual = Math.abs(comercialResistor-vector[i]);
			if(menoractual<menorfinal){
				menorfinal=menoractual;
				indice=i;
			}
		} comercialResistor=vector[indice];
		
		return comercialResistor;
	}
	/*GetComercialRandomResistor function generates a random resistor, adjust vector to its value and generates
	a valid comercial resistor. Params: Min max Range, list to adjust, resistor*/
	function GetComercialRandomResistor(min,max,pListado,pResistor){
		Reset(pListado);
		if (pResistor==null){
			var resistor = getResistor(min,max);
		} else{
			var resistor = pResistor;
		}
		toRange(resistor,pListado);
		resistor = getComercial(resistor,pListado);
		return resistor;
	}	
	/*ToWhatsappmethod URL ENCODE String to generate a whatsapp link*/
	function ToWhatsapp(text,whatsappphonenumber){
		return "https://wa.me"+whatsappphonenumber+"/?text="+encodeURIComponent(text);
	}
	/*AInversor function: Receives gain an suggested resistor. It returns
	a pair of resistor that follow the ecuation, this is theoricall value.
	Uses random function for getting one comercial resistor if required*/
	function AInversor(pGain,pTolerance){
		var initialResistor;
		var practialGain;
		var tolerancia = (pGain*pTolerance)/100;
		var up = pGain+tolerancia;
		var down = pGain-tolerancia;
		var actual=0
		
		r2=GetComercialRandomResistor(1000,10000000,listado); // Generates Comercial random resistor
		r1=r2/pGain; //Calculate R1 from ecuation
		r1=GetComercialRandomResistor(1000,10000000,listado1,r1); // Generates Comercial random resistor

		practialGain=r2/r1; //Checking
		
		if(practialGain>down && practialGain<up){
				
				console.log("Un ciclo R2: "+r2+" R1:"+r1+" Gain:"+practialGain);

			
		}
		while(!(practialGain>down && practialGain<up)){
		
		r2=GetComercialRandomResistor(1000,10000000,listado); // Generates Comercial random resistor
		r1 = r2/pGain;
		r1=GetComercialRandomResistor(1000,10000000,listado1,r1);
		practialGain=r2/r1;
		
		}
		$('#values').text("R1: "+r1+" R2: "+ r2+" Ganancia: "+practialGain);

		//return [r1,r2,practialGain];
		var saludo = "Hola! Gracias por utilizar el servicio, los valores obtenidos son: "
		var texto= "R1: "+r1+" R2: "+ r2+" Ganancia: "+practialGain;

		$('#values').text(texto); //Print on website
		texto=saludo+texto;

  		$("#whatsapp").attr("href",ToWhatsapp(texto,"")); //Generate whatsapp url
		var codeR1 = r1.toString();
		var codeR2 = r2.toString();
		ColorsCode(codeR1,false);
		ColorsCode(codeR2,true);
		console.log("Que verga!!!!!!!!!!!!!!");

	}

	function noInverter(pGain,pTolerance){
		var practialGain;
		var tolerancia = (pGain*pTolerance)/100;
		var up = pGain+tolerancia;
		var down = pGain-tolerancia;
		var actual=0;
		/*ECUATION FOR THIS AMPLIFIER GAIN=1+R2/R1*/
		r2 = GetComercialRandomResistor(1000,1000000,listado); // Get comercial RANDOM value for R2
		r1 = r2/(pGain-1); //Teorical value for R1.
		r1 = GetComercialRandomResistor(1000,1000000,listado1,r1); // Get comercial value for R1
		practialGain = 1 + (r2/r1); // Get practical gain
		if (practialGain>down&&practialGain<up){
			console.log("Un ciclo R2: "+r2+" R1:"+r1+" Gain:"+practialGain);
		}
		while(!(practialGain>down && practialGain<up)){
			r2 = GetComercialRandomResistor(1000,1000000,listado);
			r1 = r2/(pGain-1); //Teorical value for R1.
			r1 = GetComercialRandomResistor(1000,1000000,listado1,r1); // Get comercial value for r1
			practialGain = 1 + (r2/r1); // Get practical gain
		}
		var saludo = "Hola! Gracias por utilizar el servicio, los valores obtenidos son: "
		var texto= "R1: "+r1+" R2: "+ r2+" Ganancia: "+practialGain;
		$('#values').text("R1: "+r1+" R2: "+ r2+" Ganancia: "+practialGain);

		//return [r1,r2,practialGain];
		var saludo = "Hola! Gracias por utilizar el servicio, los valores obtenidos son: "
		var texto= "R1: "+r1+" R2: "+ r2+" Ganancia: "+practialGain;

		$('#values').text(texto);
		texto=saludo+texto;

		  $("#whatsapp").attr("href",ToWhatsapp(texto,""));
		var codeR1 = r1.toString();
		var codeR2 = r2.toString();
		ColorsCode(codeR1,false);
		ColorsCode(codeR2,true);
		  


	}
	function ColorsCode(pResistor,r1orr2){
		var code = {
			0:"black",
			1:"Maroon",
			2:"#e72424",
			3:"#e76624",
			4:"yellow",
			5:"green",
			6:"#24d7e7",
			7:"purple",
			8:"grey",
			9:"white"
		}
		var contador = 1;
		for (var je of pResistor){
			console.log(je);
		var change = code[je];
		console.log(change);
		
		console.log("Contador:"+contador);
		var frase="Colors";
		
		if(r1orr2 == true){
			console.log("ENTRE");
			frase = frase.toLowerCase();

		}
		var textoAux = "#"+frase+contador;
		console.log(textoAux);
		$(textoAux).css("background-color",change);
		contador++;
		if (contador>2){
			break;
		}
		
	}
	contador=3;
	textoAux = "#"+frase+contador;
	if (pResistor>=1000000){
		$(textoAux).css("background-color",code[5]);

	} else if(pResistor>=100000){
	$(textoAux).css("background-color",code[4]);

	} else if(pResistor>=10000){
		$(textoAux).css("background-color",code[3]);
	
		} else if(pResistor>=1000){
			$(textoAux).css("background-color",code[2]);
		
			} else{
				$(textoAux).css("background-color",code[1]);

			}



	}

	//console.log(AInversor(7.5,null,10));

});
