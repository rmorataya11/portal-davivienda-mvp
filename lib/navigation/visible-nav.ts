import type { NavItem } from "@/components/home/content/types";

/** Mis apps: logged in. Documentación: sandbox approved. */
export function filterVisibleNavItems(
  items: NavItem[],
  options: { user: boolean; sandboxAccess: boolean },
) {
  return items.filter((item) => {
    if (item.href === "/dashboard") {
      return options.user;
    }

    if (item.href === "/documentacion") {
      return options.user && options.sandboxAccess;
    }

    return true;
  });
}
