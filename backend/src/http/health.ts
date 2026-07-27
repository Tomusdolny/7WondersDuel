import { PROTOCOL_VERSION } from '@7ww/shared';
import type { Request, Response } from 'express';

export function healthHandler(_req: Request, res: Response): void {
  res.json({
    ok: true,
    service: '7ww-backend',
    protocolVersion: PROTOCOL_VERSION,
  });
}
