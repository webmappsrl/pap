import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';
import {environment} from 'projects/pap/src/environments/environment';
import {of} from 'rxjs';

@Component({
  selector: 'pap-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InfoComponent {
  constructor(private _sanitizer: DomSanitizer) {}
  public infoView$ = of({
    imageUrl: '/assets/images/logo.jpg',
    pageBody: this._sanitizer
      .bypassSecurityTrustHtml(`<p style="font-weight: 400;"><strong>PortAPPorta</strong> &egrave; la nuova applicazione <strong>${environment.config.name}</strong> che rende la Raccolta Differenziata ancora pi&ugrave; semplice per gli utenti dei Comuni serviti da ${environment.config.name}.</p>
    <p style="font-weight: 400;">L'applicazione localizza la tua posizione e associa automaticamente il tuo calendario utente della raccolta Porta a Porta. Potrai consultare giorni e orari di raccolta, potrai richiedere la prenotazione dei servizi di ritiro e segnalare abbandoni, ed avere tutte le informazioni riguardo ai centri di raccolta. Un'applicazione gratuita che rappresenta un utile strumento per i cittadini, che potranno comunicare in maniera diretta e immediata con l'azienda.</p>
    <p style="font-weight: 400;">${environment.config.name} Spa &egrave; una Societ&agrave; per Azioni totalmente partecipata da capitale pubblico che si occupa di raccogliere, conferire e trattare rifiuti urbani assimilati agli urbani delle utenze domestiche e non domestiche dei Comuni dell&rsquo;Isola d&rsquo;Elba.</p>
    <p style="font-weight: 400;">La raccolta differenziata &egrave; una buona occasione per migliorare la gestione dei rifiuti, separandoli e conferendoli nel modo giusto.</p>
    <p style="font-weight: 400;"><strong>&ldquo;Pensa differente&rdquo;</strong> &egrave; il claim della campagna di comunicazione ambientale di ${environment.config.name}, per dare un impulso decisivo allo sviluppo della raccolta differenziata dei rifiuti sull&rsquo;Isola d&rsquo;Elba.</p>
    <p style="font-weight: 400;"><img src="https://share.getcloudapp.com/d5uOjrWD" alt="" /><img style="display: block; margin-left: auto; margin-right: auto;" src="https://p46.f4.n0.cdn.getcloudapp.com/items/d5uOjrWD/19d49dc9-041d-43ec-983b-1d120bfdfe7e.jpg?v=8c3e81e227d2a41649976afcf542ca36" alt="" /></p>
    <p style="font-weight: 400;">Scegliere correttamente dove buttare un rifiuto &egrave; decisivo per l&rsquo;ambiente e per la qualit&agrave; di vita delle persone, &egrave; un dovere di civilt&agrave; e un prezioso contributo per rendere la nostra Isola pi&ugrave; bella!</p>`),
  });
}
