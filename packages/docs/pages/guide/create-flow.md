# Create Flow

To understand how we can create a flow, it's better to start with a real use case. Let's say we want to create a flow that will fetch new submissions from Typeform and then send them to a Slack channel. To do that, we will use [Typeform](/apps/typeform/triggers) and [Slack](/apps/slack/actions) apps. Let's start with creating connections for these apps.

## Typeform connection

- Go to the **My Apps** page in Automatisch and click on **Add connection** button.
- Select the **Typeform** app from the list.
- It will ask you `Client ID` and `Client Secret` from Typeform and there is an information box above the fields.
- Click on **our documentation** link in the information box and follow the instructions to get the `Client ID` and `Client Secret` from Typeform.

:::tip
Whenever you want to create a connection for an app, you can click on **our documentation** link in the information box to learn how to create a connection for that specific app.
:::

- After you get the `Client ID` and `Client Secret` from Typeform, you can paste them to the fields in Automatisch and click on **Submit** button.

## Slack connection

- Go to the **My Apps** page in Automatisch and click on **Add connection** button.
- Select the **Slack** app from the list.
- It will ask you `API Key` and `API Secret` values from Slack and there is an information box above the fields.
- Click on **our documentation** link in the information box and follow the instructions to get the `API Key` and `API Secret` from Slack.
- After you get the `API Key` and `API Secret` from Slack, you can paste them into the fields in Automatisch and click on **Submit** button.

## Build the flow

### Trigger step

- Go to the **Flows** page in Automatisch and click on **Create flow** button.
- It will give you empty trigger and action steps.
- For the trigger step (1st step), select the **Typeform** app from `Choose an app` dropdown.
- Select the **New entry** as the trigger event and click on the **Continue** button.
- It will ask you to select the connection you created for the Typeform app. Select the connection you have just created and click on the **Continue** button.
- Select the form you want to get the new entries from and click on the **Continue** button.
- Click on **Test & Continue** button to test the trigger step. If you see the data that reflects the recent submission in the form, you can continue to the next (action) step.

### Action step

- For the action step (2nd step), select the **Slack** app from `Choose an app` dropdown.
- Select the **Send a message to channel** as the action event and click on the **Continue** button.
- It will ask you to select the connection you created for the Slack app. Select the connection you have just created and click on the **Continue** button.
- Select the channel you want to send the message to.
- Write the message you want to send to the channel. You can use variables in the message from the trigger step.
- Select `Yes` for the `Send as a bot` option.
- Give a name for the bot and click on the **Continue** button.
- Click on **Test & Continue** button to test the action step. If you see the message in the Slack channel you selected, we can say that the flow is working as expected and is ready to be published.

### Publish the flow

- Click on the **Publish** button to publish the flow.
- Published flows will be executed automatically when the trigger event happens or at intervals of 15 minutes depending on the trigger type.
- You can not change the flow after it's published. If you want to change the flow, you need to unpublish it first and then make the changes.
