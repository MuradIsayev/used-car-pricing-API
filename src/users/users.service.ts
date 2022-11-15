import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id }); // Returns one record or null
  }

  find(email: string) {
    return this.repo.find({ where: { email } }); // Returns an array with all matched records or empty array
  }

  async update(id: number, attrs: Partial<User>) {
    /*Partial is built-in type helper. It tells us that attrs(attributes) can be any object that has none
      or at least some of the properties of the User class. That will be considered as a valid argument */
    // Find a user with an id we are looking for
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    // Apply the update
    Object.assign(user, attrs); // This method takes all the properties of attrs and copy them to the user.
    // Save the updated user
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    return this.repo.remove(user);
  }
}
