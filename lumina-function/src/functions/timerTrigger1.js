const { app } = require("@azure/functions");
const { MongoClient } = require("mongodb");

app.timer("timerTrigger1", {
  schedule: "0 * * * * *",
  handler: async (myTimer, context) => {
    context.log("Timer function started.");

    const webConnectionString = process.env.WEB_CONNECTION_STRING;
    const mobileConnectionString = process.env.MOBILE_CONNECTION_STRING;

    const webName = "lumina-web";
    const webCollectionName = "plugins";

    const mobileName = "lumina-mobile";
    const mobileCollectionName = "chatbots";

    let webClient, mobileClient;

    try {
      webClient = new MongoClient(webConnectionString, {
        useUnifiedTopology: true,
      });
      await webClient.connect();
      const webDb = webClient.db(webName);
      const webCollection = webDb.collection(webCollectionName);

      mobileClient = new MongoClient(mobileConnectionString, {
        useUnifiedTopology: true,
      });
      await mobileClient.connect();
      const mobileDb = mobileClient.db(mobileName);
      const mobileCollection = mobileDb.collection(mobileCollectionName);

      const webPlugins = await webCollection.find({}).toArray();
      context.log("webPlugins:", webPlugins);
      for (const plugin of webPlugins) {
        const filter = { _id: plugin._id };
        const update = {
          $set: {
            userEmail: plugin.userEmail,
            userName: plugin.userName,
            name: plugin.name,
            version: plugin.version,
            image: plugin.image,
            category: plugin.category,
            description: plugin.description,
            activated: plugin.activated,
            schema: plugin.schema,
          },
        };
        const options = { upsert: true };
        await mobileCollection.updateOne(filter, update, options);
        const mobileChatbots = await mobileCollection.find({}).toArray();
        context.log("mobileChatbots:", mobileChatbots);
      }
    } catch (error) {
      context.log("Error:", error);
    } finally {
      if (webClient) {
        await webClient.close();
      }
      if (mobileClient) {
        await mobileClient.close();
      }
    }
  },
});
