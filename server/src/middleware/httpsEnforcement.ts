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
  // NGINX does SSL termination and proxies to backend via HTTP
  // All requests from NGINX are internal and should bypass HTTPS enforcement
  const isInternalRequest = 
    req.ip === '127.0.0.1' || 
    req.ip === '::1' || 
    req.ip === '::ffff:127.0.0.1' ||
    req.headers['x-forwarded-for']?.includes('127.0.0.1') ||
    req.headers['host']?.includes('localhost') ||
    req.headers['x-real-ip'] || // NGINX sets this for proxied requests
    !req.headers['x-forwarded-proto']; // If no X-Forwarded-Proto, it's from NGINX (internal)

  if (isInternalRequest) {
    next();
    return;
  }

  // Check if request is secure
  // Only check for external direct requests (not from NGINX)
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











