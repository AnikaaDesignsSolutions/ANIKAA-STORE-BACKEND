import { MigrationInterface, QueryRunner } from "typeorm"

export class AddSubItem1728489008164 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "line_item" 
            ADD COLUMN "sub_items" jsonb;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "line_item" 
            DROP COLUMN "sub_items";
        `);
    }

}
