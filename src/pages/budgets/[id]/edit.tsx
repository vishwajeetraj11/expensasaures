import { Title } from "@tremor/react";
import { Models } from "appwrite";
import BudgetForm from "expensasaurus/components/forms/BudgetForm";
import Layout from "expensasaurus/components/layout/Layout";

import { ENVS } from "expensasaurus/shared/constants/constants";
import { getDoc } from "expensasaurus/shared/services/query";
import { useAuthStore } from "expensasaurus/shared/stores/useAuthStore";
import { Budget } from "expensasaurus/shared/types/budget";
import Head from "next/head";
import { useRouter } from "next/router";
import { shallow } from "zustand/shallow";

const edit = () => {
  const { user } = useAuthStore((state) => ({ user: state.user }), shallow) as {
    user: Models.Session;
  };
  const router = useRouter();
  const { id } = router.query;

  const { data } = getDoc<Budget>(
    ["Budget by ID", id, user?.userId],
    [ENVS.DB_ID, ENVS.COLLECTIONS.BUDGETS, id as string],
    { enabled: !!user }
  );
  return (
    <Layout>
      <Head>
        <title>Update Budget</title>
      </Head>
      <div className="mx-auto px-4 max-w-[1200px] mt-10 w-full flex flex-1 h-full">
        <div className="w-full lg:w-[50%]">
          <Title className="text-center mb-10">Update Budget</Title>
          <BudgetForm />
        </div>
        <div className="lg:w-[50%] hidden md:block h-auto lg:rounded-bl-[120px] xl:rounded-bl-[200px]"
          style={{ backgroundImage: `url(/img/create_budget.png)` }}
        >

        </div>
      </div>
    </Layout>
  );
};

export default edit;

