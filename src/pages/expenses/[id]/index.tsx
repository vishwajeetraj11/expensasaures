import { Metric, Text } from "@tremor/react";
import { Models } from "appwrite";
import clsx from "clsx";
import { format } from "date-fns";
import DeleteButton from "expensasaures/components/icons/DeleteButton";
import EditButton from "expensasaures/components/icons/EditButton";

import Layout from "expensasaures/components/layout/Layout";
import DeleteModal from "expensasaures/components/modal/DeleteModal";
import useDates from "expensasaures/hooks/useDates";
import { categories } from "expensasaures/shared/constants/categories";
import { ENVS } from "expensasaures/shared/constants/constants";
import {
  deleteDoc,
  getAllLists,
  getDoc,
} from "expensasaures/shared/services/query";
import { useAuthStore } from "expensasaures/shared/stores/useAuthStore";
import { Transaction } from "expensasaures/shared/types/transaction";
import { capitalize } from "expensasaures/shared/utils/common";
import { formatCurrency } from "expensasaures/shared/utils/currency";
import { getQueryForExpenses } from "expensasaures/shared/utils/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "sonner";
import { shallow } from "zustand/shallow";

const id = () => {
  const { user } = useAuthStore((state) => ({ user: state.user }), shallow) as {
    user: Models.Session;
  };
  const router = useRouter();
  const { id } = router.query;

  const { data } = getDoc<Transaction>(
    ["Expenses by ID", id, user?.userId],
    [ENVS.DB_ID, ENVS.COLLECTIONS.EXPENSES, id as string],
    { enabled: !!user }
  );

  const { mutate, reset } = deleteDoc(
    ["Delete Expenses by ID", id, user?.userId],
    [ENVS.DB_ID, ENVS.COLLECTIONS.EXPENSES, id as string],
    {}
  );

  const { data: moreExpensesInCategory } = getAllLists<Transaction>(
    ["Expenses", user?.userId, data?.category],
    [
      ENVS.DB_ID,
      ENVS.COLLECTIONS.EXPENSES,
      getQueryForExpenses({
        dates: [],
        limit: 3,
        orderByDesc: "date",
        user,
        category: data?.category || "others",
      }),
    ],
    { enabled: !!user && !!data }
  );

  const { endOfThisMonth, startOfThisMonth } = useDates();

  //   const { data: expensesThisMonth } = getAllLists<Transaction>(
  //     ["Expenses", user?.userId, endOfThisMonth, startOfThisMonth],
  //     [
  //       ENVS.DB_ID,
  //       ENVS.COLLECTIONS.EXPENSES,
  //       getQueryForExpenses({
  //         dates: [new Date(startOfThisMonth), new Date(endOfThisMonth)],
  //         orderByDesc: "date",
  //         user,
  //       }),
  //     ],
  //     { enabled: !!user && !!data }
  //   );

  const categoryInfo = categories.find((cat) => cat.key === data?.category);
  const SelectedIcon = categoryInfo?.Icon;

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  return (
    <Layout>
      <div className="mx-auto max-w-[1200px] pt-10 block">
        <div className="flex items-start flex-col md:flex-row w-full gap-10 px-4">
          <div className="flex flex-col flex-1 w-[inherit]">
            <div className="flex">
              {categoryInfo && (
                <div
                  className={clsx(
                    "min-w-[80px] h-20 w-20 bg-opacity-25 rounded-full flex items-center justify-center mr-3",
                    categoryInfo.className
                  )}
                >
                  {SelectedIcon && <SelectedIcon className="w-10 h-10" />}
                </div>
              )}

              <div>
                {data?.category && (
                  <Text className="mt-3">{capitalize(data?.category)}</Text>
                )}
                <Metric>{data?.title}</Metric>
              </div>
              <div className="flex gap-3 ml-auto">
                <EditButton
                  onClick={() => {
                    router.push(`/expenses/${id}/edit`, undefined, {
                      shallow: true,
                    });
                  }}
                />
                <DeleteButton
                  onClick={() => {
                    setIsDeleteOpen(true);
                  }}
                />
              </div>
            </div>
            <div className="ml-[92px] ">
              <div className="grid grid-cols-[80px_1fr]">
                <Text>Amount</Text>
                {data?.currency && (
                  <Text className="text-slate-700">
                    {formatCurrency(data?.currency, data?.amount || 0)}
                  </Text>
                )}
                <Text>Date</Text>

                {data?.date && (
                  <Text className="text-slate-700">
                    {format(new Date(data?.date), "dd MMM yyyy")}
                  </Text>
                )}
              </div>
              <Text className="text-slate-700 p-3 bg-slate-50 mt-2">
                {data?.description}
              </Text>
            </div>
          </div>
          <div className="md:w-[40%] w-full">
            <Text className="mb-3">More expenses in this category</Text>
            <div className="flex flex-col gap-3">
              {moreExpensesInCategory?.documents
                ?.filter((doc) => doc.$id !== id)
                .map((doc) => {
                  const categoryInfo = categories.find(
                    (cat) => cat.key === doc?.category
                  );
                  const SelectedIcon = categoryInfo?.Icon;
                  return (
                    <Link
                      className="box-shadow-card px-4 py-3 rounded-sm"
                      key={doc.$id}
                      href={`/expenses/${doc.$id}`}
                    >
                      <div className="flex items-center mt-2">
                        {categoryInfo && (
                          <div
                            className={clsx(
                              "h-8 w-8 min-w-[32px] bg-opacity-25 rounded-full flex items-center justify-center mr-3",
                              categoryInfo.className
                            )}
                          >
                            {SelectedIcon && (
                              <SelectedIcon className="w-4 h-4" />
                            )}
                          </div>
                        )}
                        <Text>{capitalize(doc?.category)}</Text>
                      </div>
                      <div className="ml-[44px]">
                        <Text className="text-slate-500">{doc.title}</Text>
                        <div className="grid grid-cols-[80px_1fr] mt-2">
                          <Text>Amount</Text>
                          {doc?.currency && (
                            <Text className="text-slate-700">
                              {formatCurrency(doc?.currency, doc?.amount || 0)}
                            </Text>
                          )}
                          <Text>Date</Text>

                          <Text className="text-slate-700">
                            {format(new Date(doc?.date), "dd MMM yyyy")}
                          </Text>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        action="delete"
        onAction={() => {
          mutate(
            {},
            {
              onSettled: () => {
                reset();
              },
              onSuccess: () => {
                toast.success("Expense deleted successfully");
                router.push("/expenses");
              },
              onError: () => {
                toast.error("Expense deletion failed");
              },
            }
          );
        }}
        resource="expense"
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
        }}
      />
    </Layout>
  );
};

export default id;