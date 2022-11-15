import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(email: string, password: string) {
    // See if email in use
    const users = await this.usersService.find(email);
    if (users.length) throw new BadRequestException('Email In Use!');

    // Hash the users password

    // Generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer; // As an output give us 32 char.
    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');
    // Create a new user and save it
    const user = await this.usersService.create(email, result);
    // Return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    // [] - Let's take a look all the users with this given email, and we assume that we get 1 user there.
    if (!user) throw new NotFoundException('User Not Found!');
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('Bad Password');
    return user;
  }
}
