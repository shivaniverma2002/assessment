import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
        throw new ConflictException('User already exists');
    }

    if (!createUserDto.password) {
        throw new Error('Password is required'); // Ensure password is provided
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // Hash the password
    const user = this.userRepository.create({ 
        ...createUserDto, 
        password: hashedPassword 
    });

    return await this.userRepository.save(user);
}


    async findOneByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } }); // Corrected to use email
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.findOneByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) { // Ensure password exists
            return user; // Return user if credentials are valid
        }
        return null; // Return null if invalid
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    
   async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
    }

    // Only hash the password if it's being updated
    if (updateUserDto.password) {
        user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    user.firstName = updateUserDto.firstName || user.firstName;
    user.lastName = updateUserDto.lastName || user.lastName;
    user.age = updateUserDto.age || user.age;
    user.address = updateUserDto.address || user.address;

    return this.userRepository.save(user);
}

   


    async remove(id: number): Promise<void> {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }
}
