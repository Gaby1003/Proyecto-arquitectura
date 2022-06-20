import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Values } from 'src/app/values';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css']
})
export class ConverterComponent implements OnInit {

  convert: FormGroup;
  arrayData: string []= [];//Datos iniciales
  auxData: number[] = [];//Datos con las potencias
  auxDataDivision: string[] = [];//datos de convercion divisiones sucesivas
  result: string = "";
  condition: boolean = true;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,) {
    this.convert = this.fb.group({
      originalBase: ["", Validators.required],
      baseConverted: ["", Validators.required],
      numberToConvert:["", Validators.required],
    })
  }

  //limpia los datos para la conversión
  clean(){
    this.arrayData = [];
    this.auxData = [];
    this.auxDataDivision = [];
    this.result = "";
    this.condition = true;
  }

  ngOnInit(): void {
  }

  //divide el numero en el arreglo y valida el número ingresado
  validateNumber(){
    this.clean()
    this.arrayData =  Array.from(String(this.convert.value.numberToConvert));
    console.log(this.arrayData)
    console.log(this.findValueLetter("A") >= this.convert.value.originalBase)
    this.validateBase();
  }

  //valida la base y llama al método convertir en caso de que sea correcto
   validateBase(){
    if(this.convert.value.originalBase === "" || this.convert.value.baseConverted === ""
        || this.convert.value.numberToConvert === ""){
          this.toastr.error("Todos los campos son obligatorios", 'Error')
    }
    this.arrayData.forEach(async element => {
      if(this.convert.value.originalBase > 36  || this.convert.value.originalBase == 1){
        this.condition = false;
        this.toastr.error("La base a convertir es mayor a 36 o es 1", 'Error')
      } else if(this.convert.value.baseConverted > 36 || this.convert.value.baseConverted == 1){
        this.condition = false;
        this.toastr.error("La base final es mayor a 36", 'Error')
      }else if((this.findValueLetter(element) == "" &&
          element >= this.convert.value.originalBase) && element != ""){
            this.condition = false;
            console.log(element)
            console.log("dentro número")
            this.toastr.error("El número no corresponde a la base original", 'Error')
      }else if(this.findValueLetter(element) >= this.convert.value.originalBase && element != ""){
        this.condition = false;
        this.toastr.error("El número no corresponde a la base original", 'Error')
      }
    });
    if(this.convert.value.numberToConvert < 0){
      this.condition = false;
      this.toastr.error("El número a convertir debe ser positivo", 'Error')
    }else if(this.convert.value.originalBase != 10 && this.condition){
      this.convertToDecimal()
    }else if(this.condition){
      this.showResult(this.convert.value.numberToConvert);
    }
  }

  //Encuentra en el enum el valor de la letra
  findValueLetter(letter: string){
    for (let data in Values){
      if(data == letter.toUpperCase()){
        return Values[data]
      }
    }
    return ""
  }

  //encuentra la letra según el valor numérico
  findLetterValue(num: number){
    for (let data in Values){
      let aux = Number(Values[data]);
      if( aux == num){
        return data
      }
    }
    return ""
  }

  //primer paso del algoritmo (base m a decimal)
   async convertToDecimal(){
    let count: number = this.arrayData.length - 1;
    let sum: number = 0; // no hace nada o que hace?
    this.arrayData.forEach(element => {
      let data = (this.findValueLetter(element) == "" ?
        Number(element) : Number(this.findValueLetter(element)));
      this.auxData[count] = (data * (Math.pow(Number(this.convert.value.originalBase), count)));
      console.log(count)
      count--;
    })
    console.log(this.auxData, "datos del arreglo")
    this.showResult(this.sumDatas())
  }

  //Convertir y mostrar
  async showResult(data: number){
    let countD: number = 0;
    await this.convertDecimalToBaseN(data, countD);
  }

  //retorna el valor en decimal
  sumDatas(){
    let total: number = 0;
    this.auxData.forEach(element => {
      total += element;
    })
    console.log(total)
    return total;
  }

  //convierte de decimal a base n con divisiones sucesivas
  async convertDecimalToBaseN(decimal: number, position: number){
    console.log("entre");
    if (decimal >= this.convert.value.baseConverted) {
      let remainder = decimal%this.convert.value.baseConverted;
      if(remainder > 9){
        this.auxDataDivision[position] = this.findLetterValue(remainder);
      }else{
        this.auxDataDivision[position] = String(remainder);
      }
      position += 1;
      this.convertDecimalToBaseN(Math.trunc(decimal/this.convert.value.baseConverted), position);
    }else{
      console.log("sali");
      this.auxDataDivision[position] = String(decimal);
      await this.auxDataDivision.reverse()
      this.result = await this.auxDataDivision.join('')
    }

  }
}
