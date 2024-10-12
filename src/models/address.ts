import { Column, Entity } from "typeorm";
import { Address as MedusaAddress } from "@medusajs/medusa";

@Entity()
export class Address extends MedusaAddress {
    // New column to store design preference description
    @Column({ type: "float", nullable: true })
    latitude: number;

    // New column to store longitude value
    @Column({ type: "float", nullable: true })
    longitude: number;
}
