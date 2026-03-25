interface DownloadAnimationIconProps {
  isAnimating?: boolean;
  className?: string;
}

export function DownloadAnimationIcon({ isAnimating = false, className = '' }: DownloadAnimationIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Arrow shaft */}
      <rect
        x="11"
        y="4"
        width="2"
        height="10"
        rx="1"
        fill="currentColor"
        className={isAnimating ? 'animate-download-arrow' : ''}
      />
      
      {/* Arrow head */}
      <path
        d="M12 16L8 12H10V10H14V12H16L12 16Z"
        fill="currentColor"
        className={isAnimating ? 'animate-download-arrow' : ''}
      />
      
      {/* Base line */}
      <rect
        x="5"
        y="18"
        width="14"
        height="2"
        rx="1"
        fill="currentColor"
      />
      
      {/* Animated progress dots */}
      {isAnimating && (
        <>
          <circle
            cx="8"
            cy="19"
            r="0.8"
            fill="currentColor"
            className="animate-download-dot"
            style={{ animationDelay: '0s' }}
          />
          <circle
            cx="12"
            cy="19"
            r="0.8"
            fill="currentColor"
            className="animate-download-dot"
            style={{ animationDelay: '0.2s' }}
          />
          <circle
            cx="16"
            cy="19"
            r="0.8"
            fill="currentColor"
            className="animate-download-dot"
            style={{ animationDelay: '0.4s' }}
          />
        </>
      )}
    </svg>
  );
}
