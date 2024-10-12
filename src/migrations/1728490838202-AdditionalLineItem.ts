import { MigrationInterface, QueryRunner } from "typeorm"

export class AdditionalLineItem1728490838202 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "line_item" 
            ADD COLUMN "material_design_data" jsonb;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "line_item" 
            DROP COLUMN "material_design_data";
        `);
    }

}
