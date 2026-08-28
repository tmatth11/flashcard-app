import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from 'postgres';

async function main() {
    const sql = postgres(process.env.DATABASE_URL!);
    const db = drizzle(sql);

    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Migrations completed!");

    await sql.end();
}

main().catch((err) => {
    console.error("Migration failed!", err);
    process.exit(1);
});