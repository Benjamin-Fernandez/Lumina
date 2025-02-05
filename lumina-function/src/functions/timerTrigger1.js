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
        // If the record is activated, sync it to the mobile database
        if (plugin.activated) {
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
        } else {
          // If the record is not activated, delete it from the mobile database
          await mobileCollection.deleteOne(filter);
        }
        const mobileChatbots = await mobileCollection.find({}).toArray();
        context.log("mobileChatbots:", mobileChatbots);
        for (const chatbots of mobileChatbots) {
          // If the record does not exist in the web database, delete it from the mobile database
          const webPlugin = await webCollection.findOne({ _id: chatbots._id });
          if (!webPlugin) {
            await mobileCollection.deleteOne({ _id: chatbots._id });
          }
        }
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
