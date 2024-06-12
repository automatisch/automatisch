# SurveyMonkey

:::info
This page explains the steps you need to follow to set up the SurveyMonkey
connection in Automatisch. If any of the steps are outdated, please let us know!
:::

1. Go to the [My Apps page of your SurveyMonkey account](https://developer.surveymonkey.com/apps/) to create a project.
2. Click on the **Add a New App** button.
3. Fill the form and submit it.
4. Go to **Settings** page.
5. Copy **OAuth Redirect URL** from Automatisch to **OAuth Redirect URIs** field, and click on the **Submit Changes** button.
6. In the same page, go to the **Scopes** section.
7. Select **Create/Modify Surveys**, **View Surveys**, **View Collectors**, **View Responses**, **Create/Modify Contacts**, **View Contacts**, **Create/Modify Webhooks**, **View Users** and **View Webhooks** scopes and click on the **Update Scopes** button.
8. Copy the **Client ID** value in the same page to the `Client ID` field on Automatisch.
9. Copy the **Secret** value in the same page to the `Client Secret` field on Automatisch.
10. Click **Submit** button on Automatisch.
11. Congrats! Start using your new SurveyMonkey connection within the flows.
