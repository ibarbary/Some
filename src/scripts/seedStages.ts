import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import mongoose from "mongoose";
import { StageModel, IStage } from "../DB/model/stage.model";

type StageSeedInput = Pick<
  IStage,
  "name" | "language" | "order_index" | "total_levels"
>;

const STAGE_SEED_DATA: StageSeedInput[] = [
  // English track
  { name: "Letters", language: "en", order_index: 1, total_levels: 3 },
  { name: "Words", language: "en", order_index: 2, total_levels: 3 },
  { name: "Sentences", language: "en", order_index: 3, total_levels: 3 },
  {
    name: "Reading & Comprehension",
    language: "en",
    order_index: 4,
    total_levels: 3,
  },

  // Arabic track
  { name: "حروف", language: "ar", order_index: 1, total_levels: 3 },
  { name: "كلمات", language: "ar", order_index: 2, total_levels: 3 },
  { name: "جمل", language: "ar", order_index: 3, total_levels: 3 },
  {
    name: "القراءة والاستيعاب",
    language: "ar",
    order_index: 4,
    total_levels: 3,
  },
];

const seedStages = async (): Promise<void> => {
  console.log(process.env.MONGO_URI);
  try {
    const MONGO_URI = process.env.MONGO_URI || "";

    if (!MONGO_URI) {
      throw new Error("No MongoDB URI found in environment variables");
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await StageModel.countDocuments();

    if (existing > 0) {
      console.log(`⚠️  Stages already seeded (${existing} found) — skipping.`);
      console.log("   To re-seed, drop the stages collection first.");
      await mongoose.disconnect();
      return;
    }

    await StageModel.insertMany(STAGE_SEED_DATA as any[]);
    console.log(`✅ Seeded ${STAGE_SEED_DATA.length} stages successfully:`);

    STAGE_SEED_DATA.forEach((s) => {
      console.log(
        `   [${s.language.toUpperCase()}] ${s.order_index}. ${s.name} (${s.total_levels} levels)`,
      );
    });

    await mongoose.disconnect();
    console.log("✅ Disconnected. Seed complete.");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedStages();
