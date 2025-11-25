import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/models/user';
import { TOKEN_CONFIG, HTTP_STATUS } from '@/lib/utils';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

interface AuthOptions {
  allowedGroup?: string[];
}

interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  token?: string;
  userRole?: string;
}

export const createSecretToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: TOKEN_CONFIG.EXPIRES_IN,
  });
};

const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};

export const auth = async (options: AuthOptions = {}, req: AuthenticatedRequest): Promise<NextResponse | void> => {
  try {
    const header = req.headers.get('authorization');
    
    if (!header) {
      return NextResponse.json(
        { message: "Token de autorização não fornecido" },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    const bearer = header.split(' ');
    const token = bearer[1];

    if (!token) {
      return NextResponse.json(
        { message: "Token inválido" },
        { status: HTTP_STATUS.FORBIDDEN }
      );
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: "Token inválido ou expirado" },
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    req.userId = decoded.id;
    req.token = token;

    if (options.allowedGroup && options.allowedGroup.length > 0) {
      const user = await getUser(decoded.id);
      
      if (!user) {
        return NextResponse.json(
          { message: "Usuário não encontrado" },
          { status: HTTP_STATUS.NOT_FOUND }
        );
      }

      if (!options.allowedGroup.includes(user.role)) {
        return NextResponse.json(
          { message: "Acesso negado. Permissões insuficientes." },
          { status: HTTP_STATUS.FORBIDDEN }
        );
      }

      req.userRole = user.role;
    }

    return;
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return NextResponse.json(
      { message: "Erro ao verificar autenticação" },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
};