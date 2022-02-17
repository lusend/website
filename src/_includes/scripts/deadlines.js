dayjs.extend(window.dayjs_plugin_utc);

$('[data-turnredafter]').each(function () {
  const table = $(this);
  const redDays = table.data('turnredafter');
  $('tbody > tr', table)
    .map(function () {
      const labelText = $('td:nth-child(1)', this).text().split('(');
      const dateText = $('td:nth-child(2)', this).text().trim();

      const currentYear = parseInt(labelText[1].trim().slice(0, -1));
      const currentDeadline = dayjs(
        dateText + ' 00:00:00',
        'MMMM DD, YYYY HH:mm:ss'
      )
        .utc()
        .utcOffset(-5, true)
        .startOf('day');

      const today = dayjs().utc().utcOffset(-5).startOf('day');
      const diff = currentDeadline.diff(today, 'day');

      const label = labelText[0].trim();
      const year = diff < 0 ? currentYear + 1 : currentYear;
      const red = diff < redDays && diff >= 0 ? true : false;
      const deadline =
        diff < 0 ? currentDeadline.add(1, 'year') : currentDeadline;

      return {
        label,
        year,
        red,
        deadline
      };
    })
    .get()
    .sort((a, b) => a.deadline.diff(b.deadline))
    .map((deadline, index) => {
      $(`tbody > tr:nth-child(${index + 1})`, table)
        .find('td:nth-child(1)')
        .addClass(() => (deadline.red ? 'text-secondary' : ''))
        .text(`${deadline.label} (${deadline.year})`);

      $(`tbody > tr:nth-child(${index + 1})`, table)
        .find('td:nth-child(2)')
        .addClass(() => (deadline.red ? 'text-secondary' : ''))
        .text(deadline.deadline.format('dddd, MMMM D, YYYY'));
    });
});
