import mongoose from "mongoose";
import { config } from "dotenv";

config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const options = {
  bufferCommands: false,
};

declare global {
  var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

let connectionPromise: Promise<typeof mongoose>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongooseConnection) {
    global._mongooseConnection = mongoose.connect(uri, options);
  }
  connectionPromise = global._mongooseConnection;
} else {
  connectionPromise = mongoose.connect(uri, options);
}

mongoose.connection.on("connected", () => {
  console.log("Conectado ao MongoDB com sucesso!");
});

mongoose.connection.on("error", (err) => {
  console.error(`Erro ao conectar ao banco: ${err}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("Desconectado do MongoDB");
});

export async function connectDB() {
  try {
    await connectionPromise;
    // Ensure connection is fully ready (readyState: 1 = connected)
    if (mongoose.connection.readyState !== 1) {
      // If not connected, wait for the connection event
      await new Promise<void>((resolve, reject) => {
        if (mongoose.connection.readyState === 1) {
          resolve();
          return;
        }

        const timeout = setTimeout(() => {
          reject(new Error("MongoDB connection timeout"));
        }, 10000);

        mongoose.connection.once("connected", () => {
          clearTimeout(timeout);
          resolve();
        });

        mongoose.connection.once("error", (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
    }
    return mongoose.connection;
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.connection.close();
  } catch (error) {
    console.error("Erro ao desconectar do banco de dados:", error);
    throw error;
  }
}

export default connectDB;
