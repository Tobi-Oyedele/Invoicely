import { FiCalendar, FiMail } from "react-icons/fi";
import { formatDate } from "../../utils/date";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  profession: string;
  createdAt: string;
  email: string;
}

export const ProfileHeader = ({
  firstName,
  lastName,
  profession,
  createdAt,
  email,
}: ProfileHeaderProps) => {
  // Generate beautiful avatar initials
  const getInitials = () => {
    const first = firstName.trim().charAt(0).toUpperCase();
    const last = lastName.trim().charAt(0).toUpperCase();
    return first || last ? `${first}${last}` : "U";
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-900/50 transition-all mb-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-linear-to-tr from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-300 text-white dark:text-zinc-950 flex items-center justify-center text-xl font-bold tracking-tight shadow-sm select-none shrink-0">
          {getInitials()}
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
            {firstName || lastName
              ? `${firstName} ${lastName}`.trim()
              : "Your Profile"}
          </h2>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
            {profession || "Your Profession"}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            <FiCalendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>Joined {formatDate(createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto flex flex-col gap-1.5 md:min-w-64">
        <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          Email Address
        </span>
        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-lg px-3.5 py-2.5 text-xs lg:text-sm text-zinc-500 dark:text-zinc-400 font-medium break-all select-all flex items-center gap-2">
          <FiMail className="w-4 h-4 text-zinc-400 shrink-0" />
          {email || "N/A"}
        </div>
      </div>
    </div>
  );
};
