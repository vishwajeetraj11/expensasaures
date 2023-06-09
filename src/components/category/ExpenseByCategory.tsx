import { CircularProgress } from "@mui/material";
import { Card, Text } from "@tremor/react";
import clsx from "clsx";
import { categories } from "expensasaurus/shared/constants/categories";
import { capitalize } from "expensasaurus/shared/utils/common";
import { formatCurrency } from "expensasaurus/shared/utils/currency";
import { useRouter } from "next/router";

interface Props {
  category: string;
  value: {
    amount: number;
    transactionsCount: number;
    budget?: number;
    currency: string;
    budgetPercent?: number;
  };
  categoryInfo: (typeof categories)[number];
  SelectedIcon?: (typeof categories)[number]["Icon"];
  i: number;
  type?: 'budget-defined' | 'budget-not-defined';
}

const ExpenseByCategory = (props: Props) => {
  const { category, categoryInfo, i, value, SelectedIcon } = props;
  const budgetDefined = props.type === 'budget-defined';
  const budgetNotDefined = props.type === 'budget-not-defined';
  const router = useRouter();

  return (
    <Card
      onClick={() => {
        router.push(`/expenses?category=${encodeURIComponent(category)}`);
      }}
      className={clsx("box-shadow-card border-none ring-0 cursor-pointer", value.transactionsCount !== 0 && 'group')}
      key={i}
    >
      <div className="flex">
        {SelectedIcon && (
          <div className={"relative"}>
            <div
              className={clsx(
                "w-10 h-10 bg-opacity-25 rounded-full flex items-center justify-center mr-3",
                categoryInfo.className
              )}
            >
              {value.budgetPercent !== 0
                && typeof value.budgetPercent === 'number'
                && budgetDefined
                && <Text className="text-xs hidden group-hover:block text-slate-600">{Math.ceil(value.budgetPercent)}%</Text>}
              <SelectedIcon className={clsx("w-5 h-5", budgetDefined ? 'group-hover:hidden' : '')} />
            </div>
            {budgetDefined && typeof value.budgetPercent === 'number' && <CircularProgress thickness={2} itemProp="" color="inherit" size="lg" variant="determinate" value={value.budgetPercent > 100 ? 100 : value.budgetPercent} className={clsx("h-11 w-11 absolute top-[-2px] left-[-2px]", categoryInfo.className.split(' ')[1])} />}
          </div>
        )}
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <Text className="font-medium text-slate-700">
              {capitalize(category)}
            </Text>

            <Text className="font-bold text-slate-900">
              {value.currency && formatCurrency(value.currency, value.amount)}
              {value.budget && value.currency
                ? `/${formatCurrency(value.currency, value.budget)}`
                : ""}
            </Text>
          </div>
          <div className="flex">
            <Text className="text-slate-700">
              {JSON.stringify(value.transactionsCount)} transaction
              {value.transactionsCount > 1 || value.transactionsCount === 0
                ? "s"
                : ""}
            </Text>
            {/* {value.budgetPercent ? (
              <Text
                className={clsx(
                  "ml-auto border rounded-full font-medium px-2 text-xs py-1 mt-1",
                  "text-slate-600 border-slate-300"
                  // value.budgetPercent === 100
                  //   ? "border-red-400 text-red-500"
                  //   : "border-blue-500 text-blue-600"
                )}
              >
                {value.budgetPercent?.toFixed(1)}%
              </Text>
            ) : null} */}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseByCategory;

{
  /* {false && thisMonthExpenses?.documents
      ? thisMonthExpenses?.documents.length > 0 && (
          <LineChart
            className="h-80 mt-8"
            data={thisMonthExpenses?.documents
              .filter((expense) => expense.category === category)
              .map((expense) => {
                const date = new Date(expense.date);
                const dateResult =
                  date.getDate() +
                  "." +
                  (date.getMonth() + 1) +
                  "." +
                  date.getFullYear();
                return {
                  date: dateResult,
                  amount: expense.amount,
                };
              })}
            index="date"
            categories={["amount"]}
            colors={["blue"]}
            valueFormatter={dataFormatter}
            showLegend={false}
            yAxisWidth={60}
            showXAxis
          />
        )
      : null} */
}
