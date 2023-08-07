const mongoose = require("mongoose");
try {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB successfully!");
} catch (error) {
  console.error("Error connecting to MongoDB:", error.message);
}

const saveRecord = async ({
  model,
  modelData,
  modelSearchData,
  recordData = null,
}) => {
  const dbRecord = await model.findOne(modelSearchData).exec();
  if (!dbRecord) {
    const record = new model(modelData);
    await record.save();
  } else if (
    dbRecord &&
    recordData &&
    dbRecord.updatedAt != recordData.updated_at
  ) {
    dbRecord.updatedAt = recordData.updated_at;
    await dbRecord.save();
  }
};

module.exports = { saveRecord };
