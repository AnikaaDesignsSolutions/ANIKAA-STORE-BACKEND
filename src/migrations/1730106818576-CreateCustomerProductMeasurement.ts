import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateCustomerProductMeasurement1730106818576 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "customer" 
            ADD COLUMN "customer_product_measurement" jsonb;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "customer" 
            DROP COLUMN "customer_product_measurement";
        `);
    }
}
