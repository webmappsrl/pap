import {Pipe, PipeTransform} from '@angular/core';
import {format as fm, formatDistanceToNow} from 'date-fns';
import {it} from 'date-fns/locale';
@Pipe({
  name: 'papTimeAgo',
  pure: false,
})
export class PapTimeAgoPipe implements PipeTransform {
  transform(currentTime: any, createdAt: string): string {
    if (!createdAt) return 'n/a';
    return formatDistanceToNow(new Date(createdAt), {addSuffix: true, locale: it});
  }
}
