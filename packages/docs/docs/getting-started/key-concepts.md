---
sidebar_position: 2
---

# Key Concepts

We will cover four main terms of Automatisch before creating our first flow.

# App

👉 Apps are the third-party services you can use with Automatisch like Twitter, Github, Twilio. You can check the complete list of available apps [here](/integrations/available-apps). Automatisch aims to connect those apps to build workflows. So whenever you work with other concepts of Automatisch, you will use apps.

:::tip

You can request a new integration [here](/integrations/request-integration). We will collect all the requests and prioritize the most requested ones.

:::

# Connection

📪 To use an app, you need to add a connection first. Connection is essentially the place where you pass the credentials of the specified service like consumer key, consumer secret, etc., to let Automatisch connect third-party apps on your behalf. Required fields for the connection will be asked when you click 'Add connection' and choose an app. You can also add multiple connections to the same app if you have more than one account to use.

# Flow

🛠️ Flow is the most crucial part of Automatisch. It's a place to arrange the business workflow by connecting multiple steps. So, for example, we can define a flow which does:

- **Search tweets** for the "Automatisch" keyword
- **Send those tweets as an email** to the contributors of Automatisch.

# Step

📄 Steps are the individual items in the flow. In our example, **searching tweets** and **sending an email** are both steps in our flow. Flows can also have more than two steps. Steps have two different types, which are trigger and action. The first step of each flow should be the trigger step, and the following steps should be action steps.
