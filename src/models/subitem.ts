import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { LineItem } from "@medusajs/medusa";  // Reference your extended LineItem

@Entity()
export class SubItem {
    @PrimaryGeneratedColumn()
    id: number;

    // Reference back to the extended LineItem
    // @ManyToOne(() => LineItem, (lineItem) => lineItem.s)
    // lineItem: LineItem;

    // Design preference for this specific sub-item
    @Column({ type: "text", nullable: true })
    design_preference: string;

    // Array of design image URLs for this specific sub-item
    @Column("text", { array: true, nullable: true })
    design_images: string[];

    // Array of material image URLs for this specific sub-item
    @Column("text", { array: true, nullable: true })
    material_images: string[];

    // Measurement values for this specific sub-item
    @Column("jsonb", { nullable: true })
    measurement_values: Record<string, number>;
}
