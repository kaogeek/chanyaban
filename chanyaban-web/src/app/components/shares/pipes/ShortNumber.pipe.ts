import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})

export class ShortNumberPipe implements PipeTransform {
  transform(number: any, ...args: any[]): any {
    if (isNaN(number) || number === undefined || number === null || number <= 0) {
      return "0";
    }

    let abs = Math.abs(number);
    const rounder = Math.pow(10, 1);
    const isNegative = number < 0; // will also work for Negetive numbers
    let key = '';

    const powers = [
      { key: 'ล้านล้าน', value: Math.pow(10, 12) },
      { key: 'พันล้าน', value: Math.pow(10, 9) },
      { key: 'ล้าน', value: Math.pow(10, 6) },
      { key: 'พัน', value: Math.pow(10, 3) },
      // { key: 'T', value: Math.pow(10, 12) },
      // { key: 'B', value: Math.pow(10, 9) },
      // { key: 'M', value: Math.pow(10, 6) },
      // { key: 'K', value: Math.pow(10, 3) },
    ];

    for (let i = 0; i < powers.length; i++) {
      let reduced = abs / powers[i].value;
      reduced = Math.round(reduced * rounder) / rounder;
      if (reduced >= 1) {
        abs = reduced;
        key = powers[i].key;
        break;
      }
    }

    return (isNegative ? '-' : '') + abs + key;
  }
}
