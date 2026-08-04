import { describe, it, expect } from 'vitest';
import { checkRoutePermission, ROUTE_PERMISSIONS, NAVIGATION_ITEMS, ROLE_DEFAULT_ROUTES } from './permissions';
import { UserRole } from '../types';

describe('RBAC Route Permission Integration', () => {
  it('correctly defaults after-login redirect targets per UserRole', () => {
    expect(ROLE_DEFAULT_ROUTES['Admin']).toBe('/admin/dashboard');
    expect(ROLE_DEFAULT_ROUTES['HR']).toBe('/hr/dashboard');
    expect(ROLE_DEFAULT_ROUTES['Manager']).toBe('/manager/dashboard');
  });

  it('correctly defines ROUTE_PERMISSIONS prefix boundaries', () => {
    expect(ROUTE_PERMISSIONS['/admin']).toEqual(['Admin']);
    expect(ROUTE_PERMISSIONS['/hr']).toEqual(['Admin', 'HR']);
    expect(ROUTE_PERMISSIONS['/manager']).toEqual(['Admin', 'Manager']);
  });

  it('verifies checkRoutePermission enforcement for different UserRoles', () => {
    const admin: UserRole = 'Admin';
    const hr: UserRole = 'HR';
    const manager: UserRole = 'Manager';

    // Admin access (Superuser access to all domain modules)
    expect(checkRoutePermission('/admin/dashboard', admin)).toBe(true);
    expect(checkRoutePermission('/hr/employees', admin)).toBe(true);
    expect(checkRoutePermission('/manager/team', admin)).toBe(true);

    // HR access (must be strictly denied Admin and Manager routes even if manually typed in URL)
    expect(checkRoutePermission('/admin/dashboard', hr)).toBe(false);
    expect(checkRoutePermission('/admin/users', hr)).toBe(false);
    expect(checkRoutePermission('/hr/dashboard', hr)).toBe(true);
    expect(checkRoutePermission('/hr/analytics', hr)).toBe(true);
    expect(checkRoutePermission('/manager/team', hr)).toBe(false);

    // Manager access (must be strictly denied Admin and HR routes)
    expect(checkRoutePermission('/admin/settings', manager)).toBe(false);
    expect(checkRoutePermission('/hr/recruitment', manager)).toBe(false);
    expect(checkRoutePermission('/manager/dashboard', manager)).toBe(true);
    expect(checkRoutePermission('/manager/leave-requests', manager)).toBe(true);
  });

  it('ensures dynamic navigation items in NAVIGATION_ITEMS match RBAC policies', () => {
    const adminNav = NAVIGATION_ITEMS.filter(item => item.allowedRoles.includes('Admin'));
    const hrNav = NAVIGATION_ITEMS.filter(item => item.allowedRoles.includes('HR'));
    const mgrNav = NAVIGATION_ITEMS.filter(item => item.allowedRoles.includes('Manager'));

    // Admin should see all items across the platform
    expect(adminNav.length).toBe(NAVIGATION_ITEMS.length);
    
    // HR and Manager should see strictly subset domain routes
    expect(hrNav.length).toBeLessThan(adminNav.length);
    expect(mgrNav.length).toBeLessThan(adminNav.length);
    
    // No Manager items should show up in HR nav and vice-versa
    hrNav.forEach(item => {
      expect(item.path.startsWith('/hr')).toBe(true);
    });
    mgrNav.forEach(item => {
      expect(item.path.startsWith('/manager')).toBe(true);
    });
  });
});
