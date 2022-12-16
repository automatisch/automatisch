const webhookFilters = [
  {
    label: "Contact Company Created",
    value: "CONTACT_COMPANY_CREATED"
  },
  {
    label: "Contact Company Deleted",
    value: "CONTACT_COMPANY_DELETED"
  },
  {
    label: "Contact Company Updated",
    value: "CONTACT_COMPANY_UPDATED"
  },
  {
    label: "Contact Created",
    value: "CONTACT_CREATED"
  },
  {
    label: "Contact Deleted",
    value: "CONTACT_DELETED"
  },
  {
    label: "Contact Updated",
    value: "CONTACT_UPDATED"
  },
  {
    label: "Customer Created",
    value: "CUSTOMER_CREATED"
  },
  {
    label: "Customer Updated",
    value: "CUSTOMER_UPDATED"
  },
  {
    label: "Document Deleted",
    value: "DOCUMENT_DELETED"
  },
  {
    label: "Document Downloaded",
    value: "DOCUMENT_DOWNLOADED"
  },
  {
    label: "Document Saved",
    value: "DOCUMENT_SAVED"
  },
  {
    label: "Document Updated",
    value: "DOCUMENT_UPDATED"
  },
  {
    label: "Flow Archived",
    value: "FLOW_ARCHIVED"
  },
  {
    label: "Flow Created",
    value: "FLOW_CREATED"
  },
  {
    label: "Flow Object Automation Action Created",
    value: "FLOW_OBJECT_AUTOMATION_ACTION_CREATED"
  },
  {
    label: "Flow Object Automation Action Deleted",
    value: "FLOW_OBJECT_AUTOMATION_ACTION_DELETED"
  },
  {
    label: "Flow Object Automation Created",
    value: "FLOW_OBJECT_AUTOMATION_CREATED"
  },
  {
    label: "Flow Object Automation Deleted",
    value: "FLOW_OBJECT_AUTOMATION_DELETED"
  },
  {
    label: "Flow Object Automation Updated",
    value: "FLOW_OBJECT_AUTOMATION_UPDATED"
  },
  {
    label: "Flow Object Automation Webdav Created",
    value: "FLOW_OBJECT_AUTOMATION_WEBDAV_CREATED"
  },
  {
    label: "Flow Object Automation Webdav Deleted",
    value: "FLOW_OBJECT_AUTOMATION_WEBDAV_DELETED"
  },
  {
    label: "Flow Object Automation Webdav Updated",
    value: "FLOW_OBJECT_AUTOMATION_WEBDAV_UPDATED"
  },
  {
    label: "Flow Object Created",
    value: "FLOW_OBJECT_CREATED"
  },
  {
    label: "Flow Object Deleted",
    value: "FLOW_OBJECT_DELETED"
  },
  {
    label: "Flow Object Document Added",
    value: "FLOW_OBJECT_DOCUMENT_ADDED"
  },
  {
    label: "Flow Object Document Removed",
    value: "FLOW_OBJECT_DOCUMENT_REMOVED"
  },
  {
    label: "Flow Object Resource Created",
    value: "FLOW_OBJECT_RESOURCE_CREATED"
  },
  {
    label: "Flow Object Resource Deleted",
    value: "FLOW_OBJECT_RESOURCE_DELETED"
  },
  {
    label: "Flow Object Resource Updated",
    value: "FLOW_OBJECT_RESOURCE_UPDATED"
  },
  {
    label: "Flow Object Task Condition Created",
    value: "FLOW_OBJECT_TASK_CONDITION_CREATED"
  },
  {
    label: "Flow Object Task Condition Deleted",
    value: "FLOW_OBJECT_TASK_CONDITION_DELETED"
  },
  {
    label: "Flow Object Task Condition Updated",
    value: "FLOW_OBJECT_TASK_CONDITION_UPDATED"
  },
  {
    label: "Flow Object Task Created",
    value: "FLOW_OBJECT_TASK_CREATED"
  },
  {
    label: "Flow Object Task Deleted",
    value: "FLOW_OBJECT_TASK_DELETED"
  },
  {
    label: "Flow Object Task Updated",
    value: "FLOW_OBJECT_TASK_UPDATED"
  },
  {
    label: "Flow Object Updated",
    value: "FLOW_OBJECT_UPDATED"
  },
  {
    label: "Flow Objects Connection Created",
    value: "FLOW_OBJECTS_CONNECTION_CREATED"
  },
  {
    label: "Flow Objects Connection Deleted",
    value: "FLOW_OBJECTS_CONNECTION_DELETED"
  },
  {
    label: "Flow Objects Connection Updated",
    value: "FLOW_OBJECTS_CONNECTION_UPDATED"
  },
  {
    label: "Flow Objects External Connection Created",
    value: "FLOW_OBJECTS_EXTERNAL_CONNECTION_CREATED"
  },
  {
    label: "Flow Objects External Connection Deleted",
    value: "FLOW_OBJECTS_EXTERNAL_CONNECTION_DELETED"
  },
  {
    label: "Flow Objects External Connection Updated",
    value: "FLOW_OBJECTS_EXTERNAL_CONNECTION_UPDATED"
  },
  {
    label: "Flow Objects External Connections Group Created",
    value: "FLOW_OBJECTS_EXTERNAL_CONNECTIONS_GROUP_CREATED"
  },
  {
    label: "Flow Objects External Connections Group Deleted",
    value: "FLOW_OBJECTS_EXTERNAL_CONNECTIONS_GROUP_DELETED"
  },
  {
    label: "Flow Objects External Connections Group Updated",
    value: "FLOW_OBJECTS_EXTERNAL_CONNECTIONS_GROUP_UPDATED"
  },
  {
    label: "Flow Unarchived",
    value: "FLOW_UNARCHIVED"
  },
  {
    label: "Flow Updated",
    value: "FLOW_UPDATED"
  },
  {
    label: "Note Created",
    value: "NOTE_CREATED"
  },
  {
    label: "Note Deleted",
    value: "NOTE_DELETED"
  },
  {
    label: "Note Updated",
    value: "NOTE_UPDATED"
  },
  {
    label: "Team Created",
    value: "TEAM_CREATED"
  },
  {
    label: "Team Deleted",
    value: "TEAM_DELETED"
  },
  {
    label: "Team Updated",
    value: "TEAM_UPDATED"
  },
  {
    label: "User Added To Team",
    value: "USER_ADDED_TO_TEAM"
  },
  {
    label: "User Added To Teamleads",
    value: "USER_ADDED_TO_TEAMLEADS"
  },
  {
    label: "User Archived",
    value: "USER_ARCHIVED"
  },
  {
    label: "User Changed Password",
    value: "USER_CHANGED_PASSWORD"
  },
  {
    label: "User Created",
    value: "USER_CREATED"
  },
  {
    label: "User Forgot Password",
    value: "USER_FORGOT_PASSWORD"
  },
  {
    label: "User Invited",
    value: "USER_INVITED"
  },
  {
    label: "User Logged In",
    value: "USER_LOGGED_IN"
  },
  {
    label: "User Notification Settings Changed",
    value: "USER_NOTIFICATION_SETTINGS_CHANGED"
  },
  {
    label: "User Profile Updated",
    value: "USER_PROFILE_UPDATED"
  },
  {
    label: "User Removed From Team",
    value: "USER_REMOVED_FROM_TEAM"
  },
  {
    label: "User Removed From Teamleads",
    value: "USER_REMOVED_FROM_TEAMLEADS"
  },
  {
    label: "User Unarchived",
    value: "USER_UNARCHIVED"
  },
  {
    label: "Workflow Archived",
    value: "WORKFLOW_ARCHIVED"
  },
  {
    label: "Workflow Completed",
    value: "WORKFLOW_COMPLETED"
  },
  {
    label: "Workflow Created",
    value: "WORKFLOW_CREATED"
  },
  {
    label: "Workflow Creation Failed",
    value: "WORKFLOW_CREATION_FAILED"
  },
  {
    label: "Workflow Object Automation Api Get Completed",
    value: "WORKFLOW_OBJECT_AUTOMATION_API_GET_COMPLETED"
  },
  {
    label: "Workflow Object Automation Api Get Failed",
    value: "WORKFLOW_OBJECT_AUTOMATION_API_GET_FAILED"
  },
  {
    label: "Workflow Object Automation Api Post Completed",
    value: "WORKFLOW_OBJECT_AUTOMATION_API_POST_COMPLETED"
  },
  {
    label: "Workflow Object Automation Api Post Failed",
    value: "WORKFLOW_OBJECT_AUTOMATION_API_POST_FAILED"
  },
  {
    label: "Workflow Object Automation Datev Completed",
    value: "WORKFLOW_OBJECT_AUTOMATION_DATEV_COMPLETED"
  },
  {
    label: "Workflow Object Automation Datev Failed",
    value: "WORKFLOW_OBJECT_AUTOMATION_DATEV_FAILED"
  },
  {
    label: "Workflow Object Automation Email Completed",
    value: "WORKFLOW_OBJECT_AUTOMATION_EMAIL_COMPLETED"
  },
  {
    label: "Workflow Object Automation Email Failed",
    value: "WORKFLOW_OBJECT_AUTOMATION_EMAIL_FAILED"
  },
  {
    label: "Workflow Object Automation Lexoffice Completed",
    value: "WORKFLOW_OBJECT_AUTOMATION_LEXOFFICE_COMPLETED"
  },
  {
    label: "Workflow Object Automation Lexoffice Failed",
    value: "WORKFLOW_OBJECT_AUTOMATION_LEXOFFICE_FAILED"
  },
  {
    label: "Workflow Object Automation Rejected",
    value: "WORKFLOW_OBJECT_AUTOMATION_REJECTED"
  },
  {
    label: "Workflow Object Automation Retried",
    value: "WORKFLOW_OBJECT_AUTOMATION_RETRIED"
  },
  {
    label: "Workflow Object Automation Sevdesk Completed",
    value: "WORKFLOW_OBJECT_AUTOMATION_SEVDESK_COMPLETED"
  },
  {
    label: "Workflow Object Automation Sevdesk Failed",
    value: "WORKFLOW_OBJECT_AUTOMATION_SEVDESK_FAILED"
  },
  {
    label: "Workflow Object Automation Stamp Completed",
    value: "WORKFLOW_OBJECT_AUTOMATION_STAMP_COMPLETED"
  },
  {
    label: "Workflow Object Automation Stamp Failed",
    value: "WORKFLOW_OBJECT_AUTOMATION_STAMP_FAILED"
  },
  {
    label: "Workflow Object Automation Task Completed",
    value: "WORKFLOW_OBJECT_AUTOMATION_TASK_COMPLETED"
  },
  {
    label: "Workflow Object Automation Task Failed",
    value: "WORKFLOW_OBJECT_AUTOMATION_TASK_FAILED"
  },
  {
    label: "Workflow Object Automation Template Completed",
    value: "WORKFLOW_OBJECT_AUTOMATION_TEMPLATE_COMPLETED"
  },
  {
    label: "Workflow Object Automation Template Failed",
    value: "WORKFLOW_OBJECT_AUTOMATION_TEMPLATE_FAILED"
  },
  {
    label: "Workflow Object Automation Webdav Document Uploaded",
    value: "WORKFLOW_OBJECT_AUTOMATION_WEBDAV_DOCUMENT_UPLOADED"
  },
  {
    label: "Workflow Object Automation Zapier Completed",
    value: "WORKFLOW_OBJECT_AUTOMATION_ZAPIER_COMPLETED"
  },
  {
    label: "Workflow Object Automation Zapier Failed",
    value: "WORKFLOW_OBJECT_AUTOMATION_ZAPIER_FAILED"
  },
  {
    label: "Workflow Object Combination Task Group Created",
    value: "WORKFLOW_OBJECT_COMBINATION_TASK_GROUP_CREATED"
  },
  {
    label: "Workflow Object Combination Task Group Deleted",
    value: "WORKFLOW_OBJECT_COMBINATION_TASK_GROUP_DELETED"
  },
  {
    label: "Workflow Object Completed Automations Finished",
    value: "WORKFLOW_OBJECT_COMPLETED_AUTOMATIONS_FINISHED"
  },
  {
    label: "Workflow Object Completed",
    value: "WORKFLOW_OBJECT_COMPLETED"
  },
  {
    label: "Workflow Object Created",
    value: "WORKFLOW_OBJECT_CREATED"
  },
  {
    label: "Workflow Object Document Added",
    value: "WORKFLOW_OBJECT_DOCUMENT_ADDED"
  },
  {
    label: "Workflow Object Document Lock Added",
    value: "WORKFLOW_OBJECT_DOCUMENT_LOCK_ADDED"
  },
  {
    label: "Workflow Object Document Lock Deleted",
    value: "WORKFLOW_OBJECT_DOCUMENT_LOCK_DELETED"
  },
  {
    label: "Workflow Object Document Removed",
    value: "WORKFLOW_OBJECT_DOCUMENT_REMOVED"
  },
  {
    label: "Workflow Object Email Added",
    value: "WORKFLOW_OBJECT_EMAIL_ADDED"
  },
  {
    label: "Workflow Object Email Removed",
    value: "WORKFLOW_OBJECT_EMAIL_REMOVED"
  },
  {
    label: "Workflow Object External User Created",
    value: "WORKFLOW_OBJECT_EXTERNAL_USER_CREATED"
  },
  {
    label: "Workflow Object External User Deleted",
    value: "WORKFLOW_OBJECT_EXTERNAL_USER_DELETED"
  },
  {
    label: "Workflow Object Note Added",
    value: "WORKFLOW_OBJECT_NOTE_ADDED"
  },
  {
    label: "Workflow Object Note Removed",
    value: "WORKFLOW_OBJECT_NOTE_REMOVED"
  },
  {
    label: "Workflow Object Resource Created",
    value: "WORKFLOW_OBJECT_RESOURCE_CREATED"
  },
  {
    label: "Workflow Object Snapshot Created",
    value: "WORKFLOW_OBJECT_SNAPSHOT_CREATED"
  },
  {
    label: "Workflow Object Task Condition Created",
    value: "WORKFLOW_OBJECT_TASK_CONDITION_CREATED"
  },
  {
    label: "Workflow Object Task Created",
    value: "WORKFLOW_OBJECT_TASK_CREATED"
  },
  {
    label: "Workflow Object Task Deleted",
    value: "WORKFLOW_OBJECT_TASK_DELETED"
  },
  {
    label: "Workflow Object Task Snapshot Created",
    value: "WORKFLOW_OBJECT_TASK_SNAPSHOT_CREATED"
  },
  {
    label: "Workflow Object Task Updated",
    value: "WORKFLOW_OBJECT_TASK_UPDATED"
  },
  {
    label: "Workflow Object Updated",
    value: "WORKFLOW_OBJECT_UPDATED"
  },
  {
    label: "Workflow Objects Connection Created",
    value: "WORKFLOW_OBJECTS_CONNECTION_CREATED"
  },
  {
    label: "Workflow Objects External Connection Created",
    value: "WORKFLOW_OBJECTS_EXTERNAL_CONNECTION_CREATED"
  },
  {
    label: "Workflow Objects External Connection Group Created",
    value: "WORKFLOW_OBJECTS_EXTERNAL_CONNECTION_GROUP_CREATED"
  },
  {
    label: "Workflow Unarchived",
    value: "WORKFLOW_UNARCHIVED"
  },
  {
    label: "Workflow Updated",
    value: "WORKFLOW_UPDATED"
  }
];

export default webhookFilters;