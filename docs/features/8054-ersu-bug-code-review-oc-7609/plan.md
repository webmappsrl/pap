> Ticket: oc:8054

# Plan — [ersu] Bug code review oc:7609 — PAP

## Contesto

Tutti i commit usano la convention `fix(oc:8054): ...`.
Il repo portapporta è gestito in un workflow separato.
Nessun commit va eseguito durante l'implementazione — tutti i commit vengono fatti dopo l'approvazione del developer.

---

## Step 1 — Crea `report-calendar.actions.ts`

**File:** `projects/pap/src/app/features/report-ticket/state/report-calendar.actions.ts` _(nuovo)_

```typescript
import {createAction, props} from '@ngrx/store';
import {Calendar} from '../../calendar/calendar.model';

export const loadReportCalendars = createAction(
  '[ReportCalendar] Load Report Calendars',
  (prop: {start_date: string; stop_date: string; exclude_in_progress?: boolean} | null = null) => ({
    prop,
  }),
);

export const loadReportCalendarsSuccess = createAction(
  '[ReportCalendar] Load Report Calendars Success',
  props<{calendars: Calendar[]}>(),
);

export const loadReportCalendarsFailure = createAction(
  '[ReportCalendar] Load Report Calendars Failure',
  props<{error: string}>(),
);
```

---

## Step 2 — Crea `report-calendar.reducer.ts`

**File:** `projects/pap/src/app/features/report-ticket/state/report-calendar.reducer.ts` _(nuovo)_

```typescript
import {createReducer, on} from '@ngrx/store';
import {Calendar} from '../../calendar/calendar.model';
import * as ReportCalendarActions from './report-calendar.actions';

export const reportCalendarFeatureKey = 'reportCalendar';

export interface ReportCalendarState {
  calendars?: Calendar[];
  loading: boolean;
  error: string;
}

export const initialState: ReportCalendarState = {
  loading: false,
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(ReportCalendarActions.loadReportCalendars, state => ({
    ...state,
    loading: true,
  })),
  on(ReportCalendarActions.loadReportCalendarsSuccess, (state, action) => ({
    ...state,
    calendars: action.calendars,
    loading: false,
  })),
  on(ReportCalendarActions.loadReportCalendarsFailure, (state, action) => ({
    ...state,
    error: action.error,
    loading: false,
  })),
);
```

---

## Step 3 — Crea `report-calendar.effects.ts`

**File:** `projects/pap/src/app/features/report-ticket/state/report-calendar.effects.ts` _(nuovo)_

Pattern corretto: `actions$.pipe(ofType, withLatestFrom, filter, switchMap(inner.pipe(catchError)))`.
Non replicare il pattern outer-`switchMap` di `CalendarEffects`.

```typescript
import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store, select} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {isLogged} from '../../../core/auth/state/auth.selectors';
import {AppState} from '../../../core/core.state';
import {CalendarService} from '../../calendar/calendar.service';
import * as ReportCalendarActions from './report-calendar.actions';

@Injectable()
export class ReportCalendarEffects {
  loadReportCalendars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportCalendarActions.loadReportCalendars),
      withLatestFrom(this._store.pipe(select(isLogged))),
      filter(([, logged]) => !!logged),
      switchMap(([action]) =>
        this._calendarService.getCalendars(action.prop!).pipe(
          map(calendars => ReportCalendarActions.loadReportCalendarsSuccess({calendars})),
          catchError(error => of(ReportCalendarActions.loadReportCalendarsFailure({error}))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private _calendarService: CalendarService,
    private _store: Store<AppState>,
  ) {}
}
```

---

## Step 4 — Crea `report-calendar.selectors.ts`

**File:** `projects/pap/src/app/features/report-ticket/state/report-calendar.selectors.ts` _(nuovo)_

```typescript
import {createFeatureSelector} from '@ngrx/store';
import * as fromReportCalendar from './report-calendar.reducer';

export const selectReportCalendarState =
  createFeatureSelector<fromReportCalendar.ReportCalendarState>(
    fromReportCalendar.reportCalendarFeatureKey,
  );
```

---

## Step 5 — Registra il nuovo slice in `core.module.ts`

**File:** `projects/pap/src/app/core/core.module.ts` _(modifica)_

Aggiungere in testa agli import TypeScript:
```typescript
import {ReportCalendarEffects} from '../features/report-ticket/state/report-calendar.effects';
import * as fromReportCalendar from '../features/report-ticket/state/report-calendar.reducer';
```

Aggiungere nell'array `imports` del `@NgModule`, dopo `StoreModule.forFeature(fromReports...)`:
```typescript
StoreModule.forFeature(fromReportCalendar.reportCalendarFeatureKey, fromReportCalendar.reducer),
```

Aggiungere in `EffectsModule.forRoot([...])`:
```typescript
ReportCalendarEffects,
```

---

## Step 6 — Aggiorna `report-ticket.component.ts`

**File:** `projects/pap/src/app/features/report-ticket/report-ticket.component.ts` _(modifica)_

Sostituire il file con:

```typescript
import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {format as fm, subDays} from 'date-fns';
import {Observable, combineLatest} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {AppState} from '../../core/core.state';
import {TicketFormConf} from '../../shared/models/form.model';
import {selectCompanyProperties, selectLoading} from '../../shared/form/state/company.selectors';
import {selectTicketFormConfByType} from '../../shared/form/state/form.selectors';
import {loadReportCalendars} from './state/report-calendar.actions';

@Component({
  selector: 'pap-report-ticket',
  templateUrl: './report-ticket.component.html',
  styleUrls: ['./report-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ReportTicketComponent {
  form$: Observable<TicketFormConf> = this._store.pipe(select(selectTicketFormConfByType('report')));

  constructor(
    private _navCtrl: NavController,
    private _store: Store<AppState>,
  ) {}

  exitPage(): void {
    this._navCtrl.pop();
  }

  ionViewWillEnter(): void {
    const start_date = fm(subDays(new Date(), 15), 'd-M-yyyy');
    const stop_date = fm(new Date(), 'd-M-yyyy');
    combineLatest([
      this._store.pipe(select(selectCompanyProperties)),
      this._store.pipe(select(selectLoading)),
    ])
      .pipe(
        filter(([, loading]) => !loading),
        take(1),
      )
      .subscribe(([properties]) => {
        this._store.dispatch(
          loadReportCalendars({
            start_date,
            stop_date,
            exclude_in_progress: properties?.enableExludeInProgress ?? false,
          }),
        );
      });
  }
}
```

---

## Step 7 — Aggiorna `report-ticket.component.spec.ts`

**File:** `projects/pap/src/app/features/report-ticket/report-ticket.component.spec.ts` _(modifica)_

I test devono:
- Importare `loadReportCalendars` (non più `loadCalendars`)
- Mockare `selectLoading` a `false` per permettere al `filter` di passare
- Aggiungere un caso: `loading === true` inizialmente → il dispatch NON viene chiamato finché `loading` non diventa `false`
- Aggiungere un caso: `properties === undefined` (fallback API error) → dispatcha con `exclude_in_progress: false`

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NavController} from '@ionic/angular';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {take} from 'rxjs/operators';
import {ReportTicketComponent} from './report-ticket.component';
import {loadReportCalendars} from './state/report-calendar.actions';
import {selectCompanyProperties, selectLoading} from '../../shared/form/state/company.selectors';
import {selectTicketFormsConfigs} from '../../shared/form/state/form.selectors';
import {reportTicketForm, TicketFormConf} from '../../shared/models/form.model';

declare const expect: (actual: any) => jasmine.Matchers<any>;

describe('ReportTicketComponent', () => {
  let fixture: ComponentFixture<ReportTicketComponent>;
  let component: ReportTicketComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportTicketComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{provide: NavController, useValue: {pop: () => undefined}}, provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ReportTicketComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('dispatches loadReportCalendars without exclude_in_progress when flag is false', () => {
    store.overrideSelector(selectLoading as any, false);
    store.overrideSelector(selectCompanyProperties as any, {enableExludeInProgress: false});
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ionViewWillEnter();

    expect(dispatchSpy).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({type: loadReportCalendars.type}),
    );
    const action = dispatchSpy.calls.mostRecent().args[0] as any;
    expect(action.prop.exclude_in_progress).not.toBeTrue();
  });

  it('dispatches loadReportCalendars with exclude_in_progress when flag is true', () => {
    store.overrideSelector(selectLoading as any, false);
    store.overrideSelector(selectCompanyProperties as any, {enableExludeInProgress: true});
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ionViewWillEnter();

    const action = dispatchSpy.calls.mostRecent().args[0] as any;
    expect(action.type).toBe(loadReportCalendars.type);
    expect(action.prop.exclude_in_progress).toBeTrue();
  });

  it('dispatches loadReportCalendars with exclude_in_progress false when properties undefined (API error fallback)', () => {
    store.overrideSelector(selectLoading as any, false);
    store.overrideSelector(selectCompanyProperties as any, undefined);
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ionViewWillEnter();

    expect(dispatchSpy).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({type: loadReportCalendars.type}),
    );
    const action = dispatchSpy.calls.mostRecent().args[0] as any;
    expect(action.prop.exclude_in_progress).toBeFalse();
  });

  it('does not dispatch while company data is loading', () => {
    store.overrideSelector(selectLoading as any, true);
    store.overrideSelector(selectCompanyProperties as any, undefined);
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ionViewWillEnter();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('exposes form$ Observable that emits backend config when store has configs', () => {
    const backendConf: TicketFormConf = {
      ...reportTicketForm,
      finalMessage: 'Backend report message',
    };
    store.overrideSelector(selectTicketFormsConfigs as any, {report: backendConf});
    store.refreshState();

    let result: TicketFormConf | undefined;
    component.form$.pipe(take(1)).subscribe(conf => {
      result = conf;
    });

    expect(result).toBeDefined();
    expect(result!.finalMessage).toBe('Backend report message');
  });

  it('falls back to hardcoded reportTicketForm when store has no configs', () => {
    store.overrideSelector(selectTicketFormsConfigs as any, null);
    store.refreshState();

    let result: TicketFormConf | undefined;
    component.form$.pipe(take(1)).subscribe(conf => {
      result = conf;
    });

    expect(result).toBeDefined();
    expect(result).toEqual(reportTicketForm);
  });
});
```

---

## Step 8 — Esegui i test e verifica

```bash
npm run test:ci
```

Tutti i test devono passare, inclusi i nuovi casi di `report-ticket.component.spec.ts`.

---

## Commit (dopo approvazione developer)

```
fix(oc:8054): separate reportCalendar store slice to prevent notification cancellation

fix(oc:8054): await company loading before dispatching loadReportCalendars
```

I due fix sono logicamente separati ma possono essere uniti in un unico commit se preferito.

PR verso `develop`.
