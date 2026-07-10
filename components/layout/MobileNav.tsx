"use client";

import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { leftNavLinks, rightNavLinks, navLinkClass } from "./Nav";
import { bookNowHref } from "@/lib/site";

const menuLinks = [...leftNavLinks, ...rightNavLinks];

/**
 * MobileNav — the tablet/mobile navigation: a hamburger button that opens a
 * drawer sliding in from the right, with an X to close it. Built on Base UI's
 * Dialog, so focus trapping, Escape-to-close, scroll lock, and ARIA wiring come
 * for free; the slide/fade are Tailwind transitions driven by Base UI's
 * `data-[starting-style]` / `data-[ending-style]` hooks.
 *
 * Rendered by `Header` only below the `xl` breakpoint (see there).
 */
export function MobileNav() {
  return (
    <Dialog.Root>
      <Dialog.Trigger aria-label="Open menu" className="text-primary">
        <Menu className="size-7" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />

        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col bg-background shadow-xl transition-transform duration-300 ease-in-out data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full">
          <div className="flex items-center justify-end border-border p-4">
            <Dialog.Title className="sr-only">Menu</Dialog.Title>
            <Dialog.Close aria-label="Close menu" className="text-primary">
              <X className="size-6" />
            </Dialog.Close>
          </div>

          <nav aria-label="Mobile" className="flex flex-col gap-5 p-6">
            {menuLinks.map((link) => (
              <Dialog.Close
                key={link.href}
                render={<Link href={link.href} />}
                className={navLinkClass}
              >
                {link.label}
              </Dialog.Close>
            ))}

            <Dialog.Close
              render={
                <Link
                  href={bookNowHref}
                  data-track="book_now_click"
                  data-track-location="mobile_nav"
                />
              }
              className={cn(
                buttonVariants(),
                "mt-2 h-auto rounded-none px-5 py-2 font-heading text-base"
              )}
            >
              Book Now
            </Dialog.Close>
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
