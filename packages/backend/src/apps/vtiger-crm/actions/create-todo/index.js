import defineAction from '../../../../helpers/define-action.js';
import { fields } from './fields.js';

export default defineAction({
  name: 'Create todo',
  key: 'createTodo',
  description: 'Create a new todo.',
  arguments: fields,

  async run($) {
    const {
      name,
      assignedTo,
      startDateAndTime,
      dueDate,
      stage,
      contactName,
      priority,
      sendNotification,
      location,
      recordCurrency,
      milestone,
      previousTask,
      parentTask,
      taskType,
      skippedReason,
      estimate,
      relatedTask,
      projectName,
      organizationName,
      sendEmailReminderBefore,
      description,
      isBillable,
      service,
      rate,
      slaName,
    } = $.step.parameters;

    const elementData = {
      subject: name,
      assigned_user_id: assignedTo || $.auth.data.userId,
      date_start: startDateAndTime,
      due_date: dueDate,
      taskstatus: stage,
      contact_id: contactName,
      taskpriority: priority,
      sendnotification: sendNotification,
      location: location,
      record_currency_id: recordCurrency,
      milestone: milestone,
      dependent_on: previousTask,
      parent_task: parentTask,
      tasktype: taskType,
      skipped_reason: skippedReason,
      estimate: estimate,
      related_task: relatedTask,
      related_project: projectName,
      account_id: organizationName,
      reminder_time: sendEmailReminderBefore,
      description: description,
      is_billable: isBillable,
      billing_service: service,
      rate: rate,
      slaid: slaName,
    };

    const body = {
      operation: 'create',
      sessionName: $.auth.data.sessionName,
      element: JSON.stringify(elementData),
      elementType: 'Calendar',
    };

    const response = await $.http.post('/webservice.php', body);

    $.setActionItem({ raw: response.data });
  },
});
