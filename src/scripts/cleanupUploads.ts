import "dotenv/config";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import r2 from "../config/r2";
import { pool } from "../database/db";
import { isFileReferenced } from "../service/fileUsage.service";
import { deleteFromR2 } from "../service/r2.service";

const GRACE_HOURS = 24;
const apply = process.argv.includes("--delete");

async function main() {
  const cutoff = Date.now() - GRACE_HOURS * 60 * 60 * 1000;
  let token: string | undefined;
  let unused = 0;
  let bytes = 0;

  do {
    const page = await r2.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        ContinuationToken: token,
      }),
    );

    for (const object of page.Contents ?? []) {
      if (!object.Key || !object.LastModified) continue;
      if (object.LastModified.getTime() > cutoff) continue;
      if (await isFileReferenced(object.Key)) continue;

      unused += 1;
      bytes += object.Size ?? 0;
      console.log(`${apply ? "Deleting" : "Would delete"} ${object.Key}`);

      if (apply) {
        // Remove the leftover picture record first, then the file itself.
        await pool.query(
          `DELETE FROM media
           WHERE file_url LIKE $1
             AND NOT EXISTS (
               SELECT 1 FROM media_attachments ma WHERE ma.media_id = media.id
             )`,
          [`%${object.Key}`],
        );
        await deleteFromR2(object.Key);
      }
    }

    token = page.NextContinuationToken;
  } while (token);

  console.log(
    `${apply ? "Deleted" : "Would delete"} ${unused} unused files (${(bytes / 1024 / 1024).toFixed(1)} MB).`,
  );
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});