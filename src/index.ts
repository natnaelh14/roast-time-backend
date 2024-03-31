import * as dotenv from "dotenv";
import "./paths";
import app from "~/app";
const PORT = process.env.PORT || 3009;

dotenv.config();

const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
server.setTimeout(120000);
