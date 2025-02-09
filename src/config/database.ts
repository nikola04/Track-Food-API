import mongoose from "mongoose";

export const connect = async () => {
  const URI = process.env.MONGODB_URI;
  if (!URI) {
    console.error("❌", "MongoDB URI is not defined in ENV Variables");
    process.exit(1);
  }

  await mongoose
    .connect(URI)
    .then(() => console.log("✅", "MongoDB Connected!"))
    .catch((err) => {
      console.error("❌", "MongoDB Not Connected: ", err);
      process.exit(1);
    });
};
