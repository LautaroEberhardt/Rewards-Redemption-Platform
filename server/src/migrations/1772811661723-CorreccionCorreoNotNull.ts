import { MigrationInterface, QueryRunner } from "typeorm";

export class CorreccionCorreoNotNull1772811661723 implements MigrationInterface {
    name = 'CorreccionCorreoNotNull1772811661723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "UQ_63665765c1a778a770c9bd585d3"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "correo"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "correo" character varying`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "UQ_63665765c1a778a770c9bd585d3" UNIQUE ("correo")`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "contrasena"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "contrasena" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "contrasena"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "contrasena" character varying(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "UQ_63665765c1a778a770c9bd585d3"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "correo"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "correo" character varying(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "UQ_63665765c1a778a770c9bd585d3" UNIQUE ("correo")`);
    }

}
