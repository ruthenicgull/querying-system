import { app } from "./app.js";
import connectDB from "./database/index.js";

const port = 8001;

try {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
} catch (error) {
  console.log(`MongoDB Connection error ${error}`);
}
