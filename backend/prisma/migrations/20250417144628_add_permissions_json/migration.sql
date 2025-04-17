/*
  Warnings:

  - You are about to drop the column `notes` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "notes",
DROP COLUMN "phone",
ADD COLUMN     "permissions" JSONB,
ALTER COLUMN "role" SET DEFAULT 'operator';
