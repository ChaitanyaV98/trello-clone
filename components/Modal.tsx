"use client";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "@/components/TaskTypeRadioGroup";
import Image from "next/image";

import { FormEvent, Fragment, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/16/solid";

function Modal() {
  const isOpen = useModalStore((state) => state.isOpen);
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const closeModal = useModalStore((state) => state.closeModal);
  const newTaskInput = useBoardStore((state) => state.newTaskInput);
  const newTaskType = useBoardStore((state) => state.newTaskType);
  const setNewTaskInput = useBoardStore((state) => state.setNewTaskInput);
  const addTask = useBoardStore((state) => state.addTask);
  const image = useBoardStore((state) => state.image);
  const setImage = useBoardStore((state) => state.setImage);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submititng");
    if (!newTaskInput) return;
    //add task
    console.log("IMAGE CHECKK====", image);
    addTask(newTaskInput, newTaskType, image);
    setImage(null);
    closeModal();
  };
  return (
    <>
      <Dialog
        as="form"
        open={isOpen}
        onClose={closeModal}
        className="relative z-50"
        onSubmit={handleSubmit}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0 overflow-y-auto"
        />
        <div className="fixed inset-0 min-h-full  flex w-screen items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md transform overflow-hidden rounded-2xl space-y-4 bg-white p-6 text-left align-middle shadow-xl duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <div className="mt-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Enter a task here..."
                className="w-full border border-gray-300 rounded-md outline-none p-5"
              />
            </div>
            <TaskTypeRadioGroup />
            <div className="mt-2">
              <button
                type="button"
                onClick={() => {
                  imagePickerRef.current?.click();
                }}
                className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                Upload Image
              </button>
              {image && (
                <Image
                  alt="Uploaded Image"
                  width={200}
                  height={200}
                  className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                  src={URL.createObjectURL(image)}
                  onClick={() => setImage(null)}
                />
              )}
              <input
                type="file"
                ref={imagePickerRef} // we r using the same ref to click the input so basically we r clicking something else but the reference is clicking the hidden input and then it opens a file prompt
                hidden
                onChange={(e) => {
                  if (!e.target.files![0].type.startsWith("image/")) return;
                  setImage(e.target.files![0]);
                }}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={!newTaskInput}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed "
              >
                Add Task
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
export default Modal;
