export default {
  name: 'List appointment fields',
  key: 'listAppointmentFields',

  async run($) {
    if ($.step.parameters.appointment) {
      return [
        {
          label: 'Appointment Time',
          key: 'appointmentTime',
          type: 'string',
          required: true,
          variables: true,
          description:
            'Overrides the estimated up time with this time. Specify number of seconds since 1970 UTC.',
        },
      ];
    }
  },
};
