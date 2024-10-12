import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateLatLong1728049990563 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "address" 
            ADD COLUMN "latitude" float,
            ADD COLUMN "longitude" float;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "address" 
            DROP COLUMN "latitude", 
            DROP COLUMN "longitude";
        `);
    }

}
