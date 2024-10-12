import { MigrationInterface, QueryRunner } from "typeorm"

export class AddMaterialImages1728480163269 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "line_item" 
            ADD COLUMN "material_images" text[];
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "line_item" 
            DROP COLUMN "material_images";
        `);
    }

}
