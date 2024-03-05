import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {

    // Cookieからデータを取得
    let authorizationHeader;
    if(req.cookies&& req.cookies["jwt"]){
      authorizationHeader = req.cookies["jwt"];
    }
    

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1]; // "Bearer <JWTトークン>" の形式からJWTトークンを抽出
      try {
        const decoded = jwt.verify(token, 'secretKey'); // JWTの検証
        req.user = decoded; // ユーザー情報をリクエストオブジェクトに追加
      } catch (err) {
        // JWTが無効な場合のエラーハンドリング
        // ここで適切なエラーレスポンスを送信するか、次に進むかを決定
      }
    } else {
      req.user = undefined;
    }

    next(); // 次のミドルウェアまたはコントローラーに進む
  }
}
