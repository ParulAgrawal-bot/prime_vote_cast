import mongoose from "mongoose";
/**
 * Mongoose + MongoDB Stable API (strict) often causes ReplicaSetNoPrimary / selection errors.
 * Use a plain SRV connection — same URI as Atlas "Connect" → Drivers.
 */

function ensureDatabaseInUri(uri, dbName) {
  const db = (dbName || "Voter").replace(/^\/+|\/+$/g, "");
  if (!uri || !db) return uri;

  if (/\.mongodb\.net\/\?/.test(uri)) {
    return uri.replace(/\.mongodb\.net\/\?/, `.mongodb.net/${db}?`);
  }
  if (/\.mongodb\.net\/$/i.test(uri)) {
    return uri.replace(/\.mongodb\.net\/$/i, `.mongodb.net/${db}`);
  }
  return uri;
}

function getStandardFallbackUri({ user, password, db }) {
  // If SRV DNS is blocked (querySrv ECONNREFUSED), fall back to a standard host list.
  // You can override these with env vars if Atlas hosts/replicaSet differ.
  const hosts =
    process.env.MONGODB_STANDARD_HOSTS?.trim() ||
    [
      "ac-ie71vnv-shard-00-00.g4dz6h8.mongodb.net:27017",
      "ac-ie71vnv-shard-00-01.g4dz6h8.mongodb.net:27017",
      "ac-ie71vnv-shard-00-02.g4dz6h8.mongodb.net:27017",
    ].join(",");

  const replicaSet =
    process.env.MONGODB_REPLICA_SET?.trim() || "atlas-12trc1-shard-0";

  const u = encodeURIComponent(user);
  const p = encodeURIComponent(password);
  const database = (db || "Voter").replace(/^\/+|\/+$/g, "");

  // authSource=admin is typical for Atlas. ssl=true required.
  return `mongodb://${u}:${p}@${hosts}/${database}?ssl=true&replicaSet=${encodeURIComponent(
    replicaSet
  )}&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`;
}

function getMongoUri() {
  const db = process.env.MONGODB_DB?.trim() || "Voter";

  const direct = process.env.MONGODB_URI?.trim();
  if (direct) {
    return ensureDatabaseInUri(direct, db);
  }

  const user = process.env.MONGODB_USER?.trim();
  const password = process.env.MONGODB_PASSWORD;
  const host =
    process.env.MONGODB_HOST?.trim() || "cluster0.g4dz6h8.mongodb.net";

  if (user && password) {
    const u = encodeURIComponent(user);
    const p = encodeURIComponent(password);
    return `mongodb+srv://${u}:${p}@${host}/${db}?retryWrites=true&w=majority&appName=Cluster0`;
  }

  return null;
}

function getResolvedUri() {
  const uri = getMongoUri();
  if (!uri) {
    throw new Error(
      "Set MONGODB_URI in .env.local, or MONGODB_USER + MONGODB_PASSWORD."
    );
  }
  return uri;
}

const globalForMongoose = globalThis;

if (!globalForMongoose.mongooseCache) {
  globalForMongoose.mongooseCache = { conn: null, promise: null };
}

const cached = globalForMongoose.mongooseCache;

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const MONGODB_URI = getResolvedUri();

    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 20_000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("[mongodb] connected:", m.connection?.name);
        return m;
      })
      .catch((err) => {
        // If SRV DNS is blocked, retry once using a standard (non-SRV) URI.
        const msg = String(err?.message || "");
        const isSrvDnsError =
          msg.includes("querySrv") ||
          msg.includes("ECONNREFUSED _mongodb._tcp") ||
          msg.includes("ENOTFOUND _mongodb._tcp");

        const user = process.env.MONGODB_USER?.trim();
        const password = process.env.MONGODB_PASSWORD;
        const db = process.env.MONGODB_DB?.trim() || "Voter";

        if (isSrvDnsError && user && password) {
          const fallbackUri = getStandardFallbackUri({ user, password, db });
          console.warn("[mongodb] SRV DNS blocked; retrying with standard URI");
          return mongoose.connect(fallbackUri, opts);
        }

        cached.promise = null;
        console.error("[mongodb] connection failed:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
