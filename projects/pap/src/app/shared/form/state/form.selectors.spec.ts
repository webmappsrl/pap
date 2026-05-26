import {selectTicketFormConfByType} from './form.selectors';
import {
  abandonmentTicketForm,
  reportTicketForm,
  ticketReservationForm,
  infoTicketForm,
  TicketFormConf,
} from '../../models/form.model';

declare const expect: (actual: any) => jasmine.Matchers<any>;

const backendConf = (finalMessage: string, ticketType: any = 'abandonment'): TicketFormConf => ({
  cancel: '',
  finalMessage,
  pages: 1,
  ticketType,
  step: [],
});

describe('selectTicketFormConfByType', () => {
  describe('when store has no loaded configs (null)', () => {
    it('should return hardcoded abandonmentTicketForm for "abandonment"', () => {
      const result = selectTicketFormConfByType('abandonment').projector(null);
      expect(result).toEqual(abandonmentTicketForm);
    });

    it('should return hardcoded reportTicketForm for "report"', () => {
      const result = selectTicketFormConfByType('report').projector(null);
      expect(result).toEqual(reportTicketForm);
    });

    it('should return hardcoded ticketReservationForm for "reservation"', () => {
      const result = selectTicketFormConfByType('reservation').projector(null);
      expect(result).toEqual(ticketReservationForm);
    });

    it('should return hardcoded infoTicketForm for "info"', () => {
      const result = selectTicketFormConfByType('info').projector(null);
      expect(result).toEqual(infoTicketForm);
    });
  });

  describe('when store has loaded configs from backend', () => {
    it('should return backend config for "abandonment"', () => {
      const conf = backendConf('Backend abandonment');
      const result = selectTicketFormConfByType('abandonment').projector({abandonment: conf});
      expect(result).toEqual(conf);
      expect(result.finalMessage).toBe('Backend abandonment');
    });

    it('should return backend config for "report"', () => {
      const conf = backendConf('Backend report', 'report');
      const result = selectTicketFormConfByType('report').projector({report: conf});
      expect(result.finalMessage).toBe('Backend report');
    });

    it('should fall back to hardcoded if the backend response is missing a key', () => {
      const result = selectTicketFormConfByType('abandonment').projector({report: backendConf('x')});
      expect(result).toEqual(abandonmentTicketForm);
    });
  });
});
