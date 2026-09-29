import { formatDate } from "../../utils/date";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  createdAt: string;
  email: string;
}

export const ProfileHeader = ({
  firstName,
  lastName,
  createdAt,
  email,
}: ProfileHeaderProps) => {
  const fullName = `${firstName} ${lastName}`.trim();
  const initials =
    `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase() ||
    email.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-4 border-y border-line py-5">
      <div
        aria-hidden
        className="flex size-11 shrink-0 select-none items-center justify-center rounded-full border border-line-strong bg-surface text-sm font-medium text-fg-muted"
      >
        {initials || "·"}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-fg">{fullName || "Add your name below"}</p>
        <p className="mt-0.5 flex flex-col text-sm sm:flex-row sm:items-baseline sm:gap-1.5">
          <span className="truncate text-fg-muted" title={email}>{email}</span>
          {createdAt && (
            <span className="shrink-0 text-fg-subtle">
              <span aria-hidden className="hidden sm:inline">· </span>
              Joined {formatDate(createdAt)}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
