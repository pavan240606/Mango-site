"use client";

import * as React from "react";

import { cn } from "./utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const scrollbarRef = React.useRef<HTMLDivElement>(null);
  const scrollThumbRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = tableContainerRef.current;
    const scrollbar = scrollbarRef.current;
    const scrollThumb = scrollThumbRef.current;

    if (!container || !scrollbar || !scrollThumb) return;

    const updateScrollbar = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      // Show/hide scrollbar based on whether scrolling is needed
      if (scrollWidth > clientWidth) {
        scrollbar.style.opacity = '1';
        
        // Calculate thumb width as percentage of scrollbar
        const thumbWidthPercentage = Math.max((clientWidth / scrollWidth) * 100, 10);
        
        // Calculate thumb position
        const maxScrollLeft = scrollWidth - clientWidth;
        const scrollPercentage = maxScrollLeft > 0 ? scrollLeft / maxScrollLeft : 0;
        const maxThumbLeft = 100 - thumbWidthPercentage;
        const thumbLeftPercentage = scrollPercentage * maxThumbLeft;

        scrollThumb.style.width = `${thumbWidthPercentage}%`;
        scrollThumb.style.transform = `translateX(${thumbLeftPercentage}%)`;
      } else {
        scrollbar.style.opacity = '0';
      }
    };

    const handleScroll = () => {
      requestAnimationFrame(updateScrollbar);
    };

    const handleScrollbarClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const rect = scrollbar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const scrollbarWidth = rect.width;
      const clickPercentage = clickX / scrollbarWidth;
      
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const targetScrollLeft = clickPercentage * maxScrollLeft;
      
      container.scrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft));
    };

    // Add event listeners
    container.addEventListener('scroll', handleScroll, { passive: true });
    scrollbar.addEventListener('click', handleScrollbarClick);
    
    // Initial update
    setTimeout(updateScrollbar, 0);
    
    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateScrollbar, 0);
    });
    resizeObserver.observe(container);

    // Also observe the table itself for content changes
    const mutationObserver = new MutationObserver(() => {
      setTimeout(updateScrollbar, 0);
    });
    
    const tableElement = container.querySelector('table');
    if (tableElement) {
      mutationObserver.observe(tableElement, {
        childList: true,
        subtree: true,
        attributes: true
      });
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
      scrollbar.removeEventListener('click', handleScrollbarClick);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* Custom horizontal scrollbar above headers */}
      <div
        ref={scrollbarRef}
        className="h-1 bg-gray-200 rounded-full mb-2 cursor-pointer opacity-0 transition-opacity duration-200"
        style={{ maxWidth: 'calc(100vw - 280px)' }}
      >
        <div
          ref={scrollThumbRef}
          className="h-full bg-gray-400 rounded-full transition-colors duration-150 ease-out hover:bg-gray-500"
          style={{ width: '0%', transform: 'translateX(0%)' }}
        />
      </div>
      
      <div
        ref={tableContainerRef}
        data-slot="table-container"
        className="relative w-full overflow-x-auto"
        style={{ maxWidth: 'calc(100vw - 280px)' }}
      >
        <table
          data-slot="table"
          className={cn("min-w-full caption-bottom text-sm", className)}
          {...props}
        />
      </div>
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap min-w-[160px] [&:has([role=checkbox])]:min-w-[80px] [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap min-w-[160px] [&:has([role=checkbox])]:min-w-[80px] [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};