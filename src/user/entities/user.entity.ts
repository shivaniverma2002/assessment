// src/user/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true }) // Ensures the email is unique
    email: string;

    @Column() // Make sure you have this for the password
    password: string; 

    @Column()
    age: number;

    @Column()
    address: string;
}
