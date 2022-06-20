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
  auxDataDivision: number[] = [];//datos de convercion divisiones sucesivas 
  // auxDataDivision: number[] = [];

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,) {
    this.convert = this.fb.group({
      originalBase: ['', Validators.required],
      baseConverted: ['', Validators.required],
      numberToConvert:['', Validators.required],
    })
  }

  ngOnInit(): void {
    // this.validateNumber()
  }

  //divide el numero en el arreglo y valida el número ingresado
  validateNumber(){
    this.arrayData =  Array.from(String(this.convert.value.numberToConvert));
    console.log(this.arrayData)
    console.log(this.findValueLetter("A") >= this.convert.value.originalBase)
    this.validateBase();
  }

  //valida la base y llama al método convertir en caso de que sea correcto
   validateBase(){
    this.arrayData.forEach(async element => {
      if(this.convert.value.originalBase > 36  || this.convert.value.originalBase == 1){
        this.toastr.error("La base a convertir es mayor a 36", 'Error')
      } else if(this.convert.value.baseConverted > 36 || this.convert.value.baseConverted == 1){
        this.toastr.error("La base final es mayor a 36", 'Error')
      }else if((this.findValueLetter(element) == "" &&
          element >= this.convert.value.originalBase) && element != ""){
            console.log(element)
            console.log("dentro número")
            this.toastr.error("El número no corresponde a la base original", 'Error')
      }else if(this.findValueLetter(element) >= this.convert.value.originalBase && element != ""){
        this.toastr.error("El número no corresponde a la base original", 'Error')
      }else{
        this.convertToDecimal()
      }
    });
  }

  //Encuentra en el enum el valor de la letra
  findValueLetter(letter: string){
    for (let data in Values){
      if(data == letter){
        return Values[data]
      }
    }
    return ""
  }

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
    this.sumDatas();
  //  await this.convertDecimalToBaseN(this.sumDatas());
  //    this.auxDataDivision.forEach(async element => {
  //      await console.log(element," dato del arreglo ");
  //    });
  }

  //retorna el valor en decimal
   sumDatas(){
    let total = 0;
    this.auxData.forEach(async element => {
      total += await element;
    })
    console.log(total)
    this.convertDecimalToBaseN(total);
    console.log(this.auxDataDivision)
    return total;
  }

  convertDecimalToBaseN(decimal: number){
    console.log("entre");
    if (decimal > this.convert.value.baseConverted) {
      let remainder = decimal%this.convert.value.baseConverted;
      this.auxDataDivision.push(remainder);
      this.convertDecimalToBaseN(Math.trunc(decimal/this.convert.value.baseConverted));
    }else{
      console.log("sali");
      this.auxDataDivision.push(decimal);
    }

  }
}
