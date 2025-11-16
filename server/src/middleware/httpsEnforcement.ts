import { Request, Response, NextFunction } from 'express';

/**
 * HTTPS Enforcement Middleware
 * Redirects HTTP to HTTPS in production
 */
export const enforceHttps = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Only enforce in production
  if (process.env.NODE_ENV !== 'production') {
    next();
    return;
  }

  // Skip HTTPS enforcement for health check and internal requests
  // Health check is used by container orchestration and should be fast
  if (req.path === '/health' || req.path === '/api/health') {
    next();
    return;
  }

  // Skip HTTPS enforcement for internal requests (from NGINX reverse proxy)
  // Internal requests come from localhost/127.0.0.1 and don't need HTTPS redirect
  const isInternalRequest = 
    req.ip === '127.0.0.1' || 
    req.ip === '::1' || 
    req.ip === '::ffff:127.0.0.1' ||
    req.headers['x-forwarded-for']?.includes('127.0.0.1') ||
    req.headers['host']?.includes('localhost');

  if (isInternalRequest) {
    next();
    return;
  }

  // Check if request is secure
  const isSecure =
    req.secure ||
    req.headers['x-forwarded-proto'] === 'https' ||
    req.headers['x-forwarded-ssl'] === 'on';

  if (!isSecure) {
    const httpsUrl = `https://${req.headers.host}${req.url}`;
    res.redirect(301, httpsUrl);
    return;
  }

  next();
};

/**
 * HTTPS Required Middleware
 * Returns error if not HTTPS (for API endpoints)
 */
export const requireHttps = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Only enforce in production
  if (process.env.NODE_ENV !== 'production') {
    next();
    return;
  }

  const isSecure =
    req.secure ||
    req.headers['x-forwarded-proto'] === 'https' ||
    req.headers['x-forwarded-ssl'] === 'on';

  if (!isSecure) {
    res.status(403).json({
      success: false,
      error: 'HTTPS required for this endpoint',
    });
    return;
  }

  next();
};











