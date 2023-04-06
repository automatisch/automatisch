import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Create totals and stats report',
  key: 'createTotalsAndStatsReport',
  description: 'Create a report with recent, year to date, and all time stats of your activities',

  async run($) {
    const { data } = await $.http.get(`/v3/athletes/${$.auth.data.athleteId}/stats`);

    $.setActionItem({
      raw: data,
    });
  },
});
