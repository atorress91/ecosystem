import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncateDecimals' })

export class TruncateDecimalsPipe implements PipeTransform {

  transform(value: number, decimals: number = 2): number {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(value * multiplier) / multiplier;
  }

}
