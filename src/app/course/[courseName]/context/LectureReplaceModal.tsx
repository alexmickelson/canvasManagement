"use client";
import Modal, { ModalControl } from "@/components/Modal";
import { Spinner } from "@/components/Spinner";

export function LectureReplaceModal({
  modal, modalText, modalCallback, isLoading,
}: {
  modal: ModalControl;
  modalText: string;
  modalCallback: () => void;
  isLoading: boolean;
}) {
  return (
    <Modal modalControl={modal} buttonText={""} buttonClass="hidden">
      {({ closeModal }) => (
        <div>
          <div className="text-center">{modalText}</div>
          <br />
          <div className="flex justify-around gap-3">
            <button
              onClick={() => {
                console.log("deleting");
                modalCallback();
              }}
              disabled={isLoading}
              className="btn-danger"
            >
              Yes
            </button>
            <button onClick={closeModal} disabled={isLoading}>
              No
            </button>
          </div>
          {isLoading && <Spinner />}
        </div>
      )}
    </Modal>
  );
}
