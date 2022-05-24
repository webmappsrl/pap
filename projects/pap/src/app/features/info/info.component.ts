import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {of} from 'rxjs';

@Component({
  selector: 'pap-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
// implements OnInit
export class InfoComponent {
  public infoView$ = of({
    imageUrl: '/assets/images/logo.jpg',
    pageBody: `PortAPPorta è la nuova applicazione ERSU che rende la Raccolta Differenziata ancora più semplice per gli utenti dei Comuni serviti da ERSU. L'applicazione localizza la tua posizione e associa automaticamente il tuo calendario utente della raccolta Porta a Porta. Potrai essere avvertito dei giorni e orari di raccolta, potrai prenotare servizi e segnalare abbandoni, ed avere tutte le informazioni riguardo ai centri di raccolta, impianti e servizi ERSU. Un'applicazione gratuita che rappresenta un utile strumento per i cittadini, che potranno comunicare in maniera diretta e immediata con l'azienda.",
  "name": "PortAPPorta Esa`,
  });

  constructor() {}

  //ngOnInit(): void {}
}
