export default function Button({
  children,
  onClick,
  disabled,
  isPrimary,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  isPrimary?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      data-primary={isPrimary}
      className="px-3 text-foreground disabled:opacity-50 disabled:cursor-not-allowed data-[primary=true]:text-white hover:opacity-75 cursor-pointer transition-all duration-200 py-0.5 rounded-sm border-muted data-[primary=true]:border-primary data-[primary=true]:bg-primary border-2 bg-none"
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
