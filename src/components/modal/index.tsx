import { Dialog } from "@headlessui/react";

import { Transition } from "@headlessui/react";
import { clsx } from "expensasaurus/shared/utils/common";
import { Fragment } from "react";

interface EModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText?: string;
  action: "delete";
  onAction: () => void;
}

const EModal = (props: EModalProps) => {
  const {
    isOpen,
    onClose,
    primaryCtaText,
    description,
    title,
    action,
    secondaryCtaText,
    onAction,
  } = props;
  const isActionDelete = action === "delete";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-700 font-normal">
                    {description}
                  </p>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none"
                    onClick={onClose}
                  >
                    {secondaryCtaText || "Cancel"}
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      "inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none"
                    )}
                    onClick={onAction}
                  >
                    {primaryCtaText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EModal;
