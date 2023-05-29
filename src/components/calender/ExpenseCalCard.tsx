import { TrashIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { formatDistance } from "date-fns";
import { categories } from "expensasaures/shared/constants/categories";
import { ENVS } from "expensasaures/shared/constants/constants";
import { database } from "expensasaures/shared/services/appwrite";
import { Transaction } from "expensasaures/shared/types/transaction";
import { timeSince } from "expensasaures/shared/utils/dates";
import Link from "next/link";
import { toast } from "sonner";
interface Props {
  expense: Transaction;
}

function ExpenseCalCard(props: Props) {
  const { expense } = props;
  let createdDate = new Date(expense.date);
  const now = new Date();
  const formattedDate = formatDistance(createdDate, now);
  const categoryInfo = categories.find(
    (category) => category.key === expense.category
  );
  const SelectedIcon = categoryInfo?.Icon;

  const onDelete = async (expenseId: string) => {
    try {
      const data = await database.deleteDocument(
        ENVS.DB_ID,
        "6467f98b8e8fe5ffa576",
        expenseId
      );
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error("Expense deletion failed.");
    }
  };

  return (
    <Link href={`/expenses/${expense.$id}`}>
      <li className="flex px-4 py-2 items-center rounded-xl transition-all duration-300 hover:bg-slate-100/80 relative">
        <div className="py-2 flex flex-1">
          {SelectedIcon && (
            <div
              className={clsx(
                "min-w-[40px] h-10 bg-opacity-25 rounded-full flex items-center justify-center mr-3",
                categoryInfo.className
              )}
            >
              <SelectedIcon className="w-5 h-5" />
            </div>
          )}

          <div className="w-[65%]">
            <p className="text-stone-700 font-semibold text-md">
              {expense.title}
            </p>
            <p className="text-stone-600 text-xs font-medium line-clamp-1">
              {expense.description}
            </p>
          </div>
          <div className="ml-auto flex flex-col">
            <p className="text-xs  text-slate-500 text-right">
              {timeSince(createdDate) || formattedDate}
            </p>
            <div
              onClick={(e) => onDelete(expense.$id)}
              className="bg-red-500/30 cursor-pointer mt-auto ml-auto w-5 h-5 rounded-full flex items-center justify-center"
            >
              <TrashIcon className="text-red-500 w-3 h-3" />
            </div>
          </div>
        </div>
      </li>
    </Link>
  );
}

export default ExpenseCalCard;
