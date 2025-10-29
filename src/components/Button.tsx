/**
 * A styled button component, inspired by the IntelliJ IDEA UI.
 *
 * @property children - The content of the button.
 * @property onClick - The function to call when the button is clicked.
 * @property disabled - Whether the button is disabled.
 * @property isPrimary - True if the button has the primary variant, false if it has the secondary variant.
 * @property type - The HTML type of the button.
 */
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
