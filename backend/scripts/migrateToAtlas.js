import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const LOCAL_URI = 'mongodb://127.0.0.1:27017/clubverse';
// URL-encoded @ as %40 in password Abin@2708 -> Abin%402708
const ATLAS_URI = 'mongodb+srv://abin:Abin%402708@cluster0.db8hwqs.mongodb.net/clubverse?retryWrites=true&w=majority';

async function migrate() {
  console.log('🔄 Connecting to Local MongoDB:', LOCAL_URI);
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log('✅ Local MongoDB Connected.');

  console.log('🔄 Connecting to MongoDB Atlas:', ATLAS_URI);
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  console.log('✅ MongoDB Atlas Connected.');

  const collections = await localConn.db.listCollections().toArray();
  console.log(`\n📦 Found ${collections.length} collection(s) in local DB:`);
  collections.forEach(c => console.log(` - ${c.name}`));

  for (const col of collections) {
    const colName = col.name;
    if (colName.startsWith('system.')) continue;

    console.log(`\n🚚 Migrating collection: "${colName}"...`);
    const localCollection = localConn.db.collection(colName);
    const docs = await localCollection.find({}).toArray();

    if (docs.length === 0) {
      console.log(`   ℹ️ Collection "${colName}" is empty. Skipping.`);
      continue;
    }

    const atlasCollection = atlasConn.db.collection(colName);
    
    // Clear existing docs in Atlas for clean sync (optional)
    await atlasCollection.deleteMany({});
    
    // Insert documents into Atlas
    const result = await atlasCollection.insertMany(docs);
    console.log(`   ✅ Transferred ${result.insertedCount} document(s) to Atlas.`);
  }

  console.log('\n🎉 MIGRATION COMPLETE! All local data is now on MongoDB Atlas.');

  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

migrate().catch(err => {
  console.error('\n❌ Migration Failed:', err);
  process.exit(1);
});
