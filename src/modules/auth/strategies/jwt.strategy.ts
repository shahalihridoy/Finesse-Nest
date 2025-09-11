import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { eq } from 'drizzle-orm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DatabaseService } from '../../../database/database.service';
import { users } from '../../../database/schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly db: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'your-secret-key'),
    });
  }

  async validate(payload: any) {
    const db = this.db.getDb();
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.sub),
      with: {
        customer: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
