import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Adicione qualquer lógica personalizada aqui
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Você pode lançar uma exceção com base em "info" ou "err"
    if (err || !user) {
      throw err || new UnauthorizedException('Acesso não autorizado');
    }
    return user;
  }
}