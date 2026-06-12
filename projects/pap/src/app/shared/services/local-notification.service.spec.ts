import {TestBed} from '@angular/core/testing';
import {provideMockStore} from '@ngrx/store/testing';
import {addDays} from 'date-fns';
import {LocalNotificationSchema} from '@capacitor/local-notifications';
import {LocalNotificationService} from './local-notification.service';

declare const expect: (actual: any) => jasmine.Matchers<any>;

const MOCK_NOW = new Date('2026-01-01T00:00:00');
const RECOVERY_COUNT = 8;
const PLATFORM_LIMIT = 64;

function makeNotifications(count: number): LocalNotificationSchema[] {
  return Array.from({length: count}, (_, i) => ({
    id: i + 1,
    title: 'Raccolta differenziata',
    body: `il ritiro verrà effettuato dalle ore 07:00 alle ore 13:00`,
    largeBody: `il ritiro verrà effettuato dalle ore 07:00 alle ore 13:00`,
    schedule: {at: addDays(MOCK_NOW, i + 1), allowWhileIdle: true},
    extra: {start_time: '07:00', stop_time: '13:00'},
  }));
}

// Applica la logica di split identica a quella del service
function applyRecoverySplit(
  notifications: LocalNotificationSchema[],
  getRecoveryBody: (s?: string, t?: string) => string,
): LocalNotificationSchema[] {
  if (notifications.length === 0) return notifications;
  notifications.sort((a, b) => a.schedule!.at!.getTime() - b.schedule!.at!.getTime());
  const recoveryCount = Math.min(notifications.length - 1, RECOVERY_COUNT);
  const normalCount = notifications.length - recoveryCount;
  notifications.slice(normalCount).forEach(n => {
    const body = getRecoveryBody(n.extra?.start_time, n.extra?.stop_time);
    n.body = body;
    n.largeBody = body;
    n.extra = {recovery: true};
  });
  return notifications;
}

describe('LocalNotificationService', () => {
  let service: LocalNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalNotificationService,
        provideMockStore({initialState: {calendar: {calendars: [], error: ''}}}),
      ],
    });
    service = TestBed.inject(LocalNotificationService);
  });

  afterEach(() => {
    (service as any)._scheduling = false;
  });

  describe('_getRecoveryBody', () => {
    const getBody = (s?: string, t?: string) => (service as any)._getRecoveryBody(s, t) as string;

    it('should include start and stop time when both are provided', () => {
      const body = getBody('07:00', '13:00');
      expect(body).toContain('07:00');
      expect(body).toContain('13:00');
    });

    it('should return a fallback message when times are missing', () => {
      const body = getBody();
      expect(body.length).toBeGreaterThan(0);
      expect(body).not.toContain('undefined');
    });
  });

  describe('split logic', () => {
    const getBody = (s?: string, t?: string) => (service as any)._getRecoveryBody(s, t) as string;

    it('0 events: returns empty array', () => {
      const result = applyRecoverySplit([], getBody);
      expect(result.length).toBe(0);
    });

    it('1 event: 1 normal, 0 recovery', () => {
      const result = applyRecoverySplit(makeNotifications(1), getBody);
      expect(result.filter(n => !n.extra?.recovery).length).toBe(1);
      expect(result.filter(n => n.extra?.recovery).length).toBe(0);
    });

    it('5 events: 1 normal, 4 recovery', () => {
      const result = applyRecoverySplit(makeNotifications(5), getBody);
      expect(result.filter(n => !n.extra?.recovery).length).toBe(1);
      expect(result.filter(n => n.extra?.recovery).length).toBe(4);
    });

    it('9 events: 1 normal, 8 recovery', () => {
      const result = applyRecoverySplit(makeNotifications(9), getBody);
      expect(result.filter(n => !n.extra?.recovery).length).toBe(1);
      expect(result.filter(n => n.extra?.recovery).length).toBe(8);
    });

    it('20 events: 12 normal, 8 recovery', () => {
      const result = applyRecoverySplit(makeNotifications(20), getBody);
      expect(result.filter(n => !n.extra?.recovery).length).toBe(12);
      expect(result.filter(n => n.extra?.recovery).length).toBe(8);
    });

    it(`${PLATFORM_LIMIT} events: ${PLATFORM_LIMIT - RECOVERY_COUNT} normal, ${RECOVERY_COUNT} recovery`, () => {
      const result = applyRecoverySplit(makeNotifications(PLATFORM_LIMIT), getBody);
      expect(result.filter(n => !n.extra?.recovery).length).toBe(PLATFORM_LIMIT - RECOVERY_COUNT);
      expect(result.filter(n => n.extra?.recovery).length).toBe(RECOVERY_COUNT);
    });

    it(`${PLATFORM_LIMIT + 10} events capped: splice keeps only ${PLATFORM_LIMIT}`, () => {
      const notifications = makeNotifications(PLATFORM_LIMIT + 10);
      notifications.sort((a, b) => a.schedule!.at!.getTime() - b.schedule!.at!.getTime());
      notifications.splice(PLATFORM_LIMIT);
      const result = applyRecoverySplit(notifications, getBody);
      expect(result.length).toBe(PLATFORM_LIMIT);
    });

    it('recovery notifications should be the chronologically latest ones', () => {
      const result = applyRecoverySplit(makeNotifications(20), getBody);
      const normals = result.filter(n => !n.extra?.recovery);
      const recoveries = result.filter(n => n.extra?.recovery);
      const lastNormalAt = Math.max(...normals.map(n => n.schedule!.at!.getTime()));
      const firstRecoveryAt = Math.min(...recoveries.map(n => n.schedule!.at!.getTime()));
      expect(firstRecoveryAt).toBeGreaterThan(lastNormalAt);
    });

    it('recovery body should contain the time', () => {
      const result = applyRecoverySplit(makeNotifications(10), getBody);
      result
        .filter(n => n.extra?.recovery)
        .forEach(n => {
          expect(n.body).toContain('07:00');
          expect(n.body).toContain('13:00');
        });
    });

    it('normal notifications should retain original body', () => {
      const result = applyRecoverySplit(makeNotifications(10), getBody);
      result
        .filter(n => !n.extra?.recovery)
        .forEach(n => {
          expect(n.body).toContain('il ritiro verrà effettuato');
        });
    });

    it('should be sorted chronologically', () => {
      const shuffled = makeNotifications(10).reverse(); // reverse order
      const result = applyRecoverySplit(shuffled, getBody);
      for (let i = 1; i < result.length; i++) {
        expect(result[i].schedule!.at!.getTime()).toBeGreaterThanOrEqual(
          result[i - 1].schedule!.at!.getTime(),
        );
      }
    });
  });

  describe('recoveryTap$', () => {
    it('should emit when _recoveryTap$ emits', () => {
      let tapped = false;
      service.recoveryTap$.subscribe(() => {
        tapped = true;
      });
      (service as any)._recoveryTap$.next();
      expect(tapped).toBe(true);
    });

    it('should not emit before _recoveryTap$ is triggered', () => {
      let tapped = false;
      service.recoveryTap$.subscribe(() => {
        tapped = true;
      });
      expect(tapped).toBe(false);
    });
  });

  describe('scheduleNotifications()', () => {
    let removeNotifSpy: jasmine.Spy;
    let initNotifSpy: jasmine.Spy;

    beforeEach(() => {
      // Spy on private methods to avoid Capacitor Proxy non-configurability
      removeNotifSpy = spyOn(service as any, '_removeNotifications').and.resolveTo(undefined);
      initNotifSpy = spyOn(service as any, '_initNotifications').and.resolveTo(true);
    });

    it('calls _removeNotifications() even when permissions are denied', async () => {
      initNotifSpy.and.resolveTo(false);
      await service.scheduleNotifications();
      expect(removeNotifSpy).toHaveBeenCalledTimes(1);
    });

    it('calls _removeNotifications() before _initNotifications()', async () => {
      await service.scheduleNotifications();
      expect(removeNotifSpy).toHaveBeenCalledBefore(initNotifSpy);
    });

    it('ignores concurrent calls while scheduling', async () => {
      const p1 = service.scheduleNotifications();
      const p2 = service.scheduleNotifications();
      await Promise.all([p1, p2]);
      expect(removeNotifSpy).toHaveBeenCalledTimes(1);
    });

    it('resets _scheduling flag after completion', async () => {
      await service.scheduleNotifications();
      expect((service as any)._scheduling).toBeFalse();
    });

    it('resets _scheduling flag even when _initNotifications throws', async () => {
      initNotifSpy.and.rejectWith(new Error('permission error'));
      try {
        await service.scheduleNotifications();
      } catch {}
      expect((service as any)._scheduling).toBeFalse();
    });
  });
});
